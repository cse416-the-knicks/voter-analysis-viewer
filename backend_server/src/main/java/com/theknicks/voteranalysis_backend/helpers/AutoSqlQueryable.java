package com.theknicks.voteranalysis_backend.helpers;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import org.springframework.jdbc.core.RowMapper;

import java.lang.reflect.*;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Dictionary;
import java.util.Optional;

/*
 * NOTE(jerry):
 * I like metaprogramming, since I think it's interesting to write code that generates
 * code (or otherwise automates stuff.)
 *
 * Was quite inspired by the annotations portion of lecture, and might as well write some for once.
 *
 * This provides a relatively slick (at least as best as can be said in Java) way to
 * autogenerate SQL queries, and the appropriate JDBC RowMapper wrapper classes.
 *
 * It works through reflection and primarily because the code is so repetitive that it's
 * very easy to write code that makes the JRE do it for me.
 */
public class AutoSqlQueryable<T> {
    private static class SqlQueryableInvocationHandler implements InvocationHandler {
        private final Class<?> _mappableClass;
        private boolean _isAggregateSumQuery = false;
        private Object[] _contextArgs;

        public SqlQueryableInvocationHandler(Class<?> mappableClass) {
            _mappableClass = mappableClass;
        }

        public void setIsAggregateSumQuery(boolean v) {
            _isAggregateSumQuery = v;
        }

        public void setContextArgs(Object[] contextArgs) {
            _contextArgs = contextArgs;
        }

        public Object invoke(Object proxy, Method method, Object[] args)
                throws Throwable

        {
            /*
             * two args:
             * ResultSet,
             * int rowNumber
             */
            if (method.getName().equals("mapRow")) {
                var allConstructors = _mappableClass.getDeclaredConstructors();

                if (args.length != 2) {
                    throw new IllegalArgumentException("mapRow only has two arguments.");
                }

                if (allConstructors.length != 1) {
                    throw new IllegalArgumentException(
                            "The mappable class is not a simple POJO (single constructor record");
                }

                var defaultConstructor = allConstructors[0];
                var resultSet = (ResultSet) args[0];
                var callingArguments = new ArrayList<Object>();
                var qualifyingFields = AutoSqlQueryable.filterForAllQueryableFields(
                        _mappableClass.getDeclaredFields(), _isAggregateSumQuery);

                // I'm praying these are in order!
                int columnNumber = 1;
                for (var field : qualifyingFields) {
                    var type = field.getType();
                    if ((type == int.class || type == Integer.class)) {
                        var newValue = resultSet.getInt(columnNumber);
                        callingArguments.add(newValue);
                    } else if ((type == float.class || type == Float.class)) {
                        var newValue = resultSet.getFloat(columnNumber);
                        callingArguments.add(newValue);
                    } else if ((type == long.class || type == Long.class)) {
                        var newValue = resultSet.getLong(columnNumber);
                        callingArguments.add(newValue);
                    } else if ((type == double.class || type == Double.class)) {
                        var newValue = resultSet.getDouble(columnNumber);
                        callingArguments.add(newValue);
                    } else if ((type == String.class)) {
                        var newValue = resultSet.getString(columnNumber);
                        callingArguments.add(newValue);
                    }else {
                        throw new RuntimeException(
                                String.format("The class type \"%s\" does not have a mapped function!",
                                        type.getName()));
                    }
                    columnNumber++;
                }

                /*
                 * NOTE(jerry):
                 * Check the collection we're in, and see if
                 * there's any collection dependent processing
                 *
                 * FIXME(jerry):
                 * This is specifically because we have a field that can't
                 * be queried from the db so this is a little dirty here!!!
                 *
                 * SHOULD BE REMOVED WHEN COUNTY NAMES ARE QUERYABLE.
                 */
                var autoSqlAnnotation = (AutoSql) _mappableClass.getAnnotation(AutoSql.class);
                if (autoSqlAnnotation.collection().contains("eavs_data")) {
                    if (_isAggregateSumQuery) {
                        callingArguments.add(0, "0000000000");
                        callingArguments.add(1, "Aggregated");
                    } else {
                    /*
                        for the eavs_data collection, I can't get the county name without
                        extra context info.
                     */
                        @SuppressWarnings("unchecked")
                        var fipsToCountyNameMap = (Dictionary<String, String>) _contextArgs[0];
                        var regionId = resultSet.getString("region_id");
                        var countyName = fipsToCountyNameMap.get(regionId);
                        if (countyName == null || countyName.isBlank()) {
                            countyName = "N/A";
                        }
                    /*
                        The eavs_data records have the form

                        0 String fullRegionId,
                        1 String countyName,
                        ...
                        ..
                        N ...
                     */
                        callingArguments.add(1, countyName);
                    }
                }

                return defaultConstructor.newInstance(callingArguments.toArray());
            }

            return null;
        }
    }

    private final Class<T> _class;
    private static RowMapper _mapperInstance; // cache the mapper as a singleton

    public AutoSqlQueryable(Class<T> classData) {
        _class = classData;
    }

    private static boolean isOmittedFromSumAggregate(Field field) {
        var columnNameAnnotation = field.getAnnotation(SqlColumnName.class);
        if (columnNameAnnotation == null) {
            return true;
        }

        return (columnNameAnnotation.omitFromAggregate());
    }

    private static Optional<String> getSqlName(Field field) {
        var columnNameAnnotation = field.getAnnotation(SqlColumnName.class);
        if (columnNameAnnotation == null) {
            return Optional.empty();
        }

        if (columnNameAnnotation.name().isEmpty()) {
            return Optional.of(field.getName());
        } else {
            return Optional.of(columnNameAnnotation.name());
        }
    }

    private static Field[] filterForAllQueryableFields(Field[] fieldsList, boolean asSumAggregate) {
        // TIL(jerry): Java syntax? Method Reference Syntax
        return Arrays.stream(fieldsList).filter(
                (field) -> {
                    if (getSqlName(field).isPresent()) {
                        return !asSumAggregate || !isOmittedFromSumAggregate(field);
                    }
                    return false;
                }
        ).toArray(Field[]::new);
    }

    // Happens to be fine for numeric data, might need to evolve as I think
    // more about this
    public String Query(boolean asSumAggregate) {
        var result = new StringBuilder();
        var selfClass = _class;
        var autoSqlAnnotation = selfClass.getAnnotation(AutoSql.class);
        result.append("select\n");
        // For records, which is the use-case this is everything.
        var fieldsToWrite = filterForAllQueryableFields(
                selfClass.getDeclaredFields(), asSumAggregate);

        for (int i = 0; i < fieldsToWrite.length; ++i) {
            var field = fieldsToWrite[i];
            var queryName = getSqlName(field);
            if (queryName.isPresent()) {
                if (asSumAggregate) {
                    result.append("sum(");
                }
                result.append(queryName.get());
                if (asSumAggregate) {
                    result.append(")");
                }
                if (i+1 >= fieldsToWrite.length) {
                    // omit
                } else {
                    result.append(",\n");
                }
            }
        }

        result.append("\nfrom ");
        result.append(autoSqlAnnotation.collection());
        result.append("\n");
        return result.toString();
    }

    /**
     * This does some really slick stuff to automate
     * the generation of the row mappers.
     */
    public RowMapper<T> Mapper(Object[] contextArgs, boolean isSumAggregate) {
        SqlQueryableInvocationHandler invocationHandler;
        if (_mapperInstance == null) {
            invocationHandler = new SqlQueryableInvocationHandler(_class);
            @SuppressWarnings("unchecked")
            var proxy = (RowMapper<T>) Proxy.newProxyInstance(
                RowMapper.class.getClassLoader(),
                new Class[] { RowMapper.class },
                invocationHandler
            );
            _mapperInstance = proxy;
        } else {
            // Using the memoized query handler.
            invocationHandler = (SqlQueryableInvocationHandler)
                    Proxy.getInvocationHandler(_mapperInstance);
        }
        invocationHandler.setIsAggregateSumQuery(isSumAggregate);
        invocationHandler.setContextArgs(contextArgs);
        //noinspection unchecked
        return (RowMapper<T>) _mapperInstance;
    }

    public static <T> AutoSqlQueryable<T> findQueryableNested(Class<T> T) {
        try {
            AutoSqlQueryable<T> queryable = null;
            Class<?>[] innerClasses = T.getDeclaredClasses();
            for (Class<?> inner : innerClasses) {
                if (inner.getSimpleName().equals("Queryable")) {
                    @SuppressWarnings("unchecked")
                    var constructor =  (Constructor<AutoSqlQueryable<T>>) inner.getDeclaredConstructor();
                    queryable = (AutoSqlQueryable<T>) constructor.newInstance();
                    break;
                }
            }
            return queryable;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}