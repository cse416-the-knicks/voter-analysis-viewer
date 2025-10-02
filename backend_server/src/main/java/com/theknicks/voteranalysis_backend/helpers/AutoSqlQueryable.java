package com.theknicks.voteranalysis_backend.helpers;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import org.springframework.jdbc.core.RowMapper;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

/**
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
        private Class  _mappableClass;
        private boolean _isAggregateSumQuery = false;

        public SqlQueryableInvocationHandler(Class mappableClass) {
            _mappableClass = mappableClass;
        }

        public void setIsAggregateSumQuery(boolean v) {
            _isAggregateSumQuery = v;
        }

        public Object invoke(Object proxy, Method method, Object args[])
                throws Throwable

        {
            /**
             * two args:
             * ResultSet,
             * int rowNumber
             */
            if (method.getName() == "mapRow") {
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

                for (var field : qualifyingFields) {
                    // NOTE(jerry): I assert that this is true, if it was queryable
                    // then it has a SqlName / queryName.
                    var queryName = AutoSqlQueryable.getSqlName(field).get();
                    var type = field.getType();
                    if ((type == int.class || type == Integer.class)) {
                        var newValue = resultSet.getInt(queryName);
                        callingArguments.add(newValue);
                    } else if ((type == float.class || type == Float.class)) {
                        var newValue = resultSet.getFloat(queryName);
                        callingArguments.add(newValue);
                    } else if ((type == long.class || type == Long.class)) {
                        var newValue = resultSet.getLong(queryName);
                        callingArguments.add(newValue);
                    } else if ((type == double.class || type == Double.class)) {
                        var newValue = resultSet.getDouble(queryName);
                        callingArguments.add(newValue);
                    } else if ((type == String.class)) {
                        var newValue = resultSet.getString(queryName);
                        callingArguments.add(newValue);
                    }else {
                        throw new RuntimeException(
                                String.format("The class type \"%s\" does not have a mapped function!",
                                        type.getName()));
                    }
                }

                defaultConstructor.newInstance(
                        (Object[]) callingArguments.toArray());
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
        return (Field[]) Arrays.stream(fieldsList).filter(
                (field) -> {
                    if (getSqlName(field).isPresent()) {
                        if (asSumAggregate && isOmittedFromSumAggregate(field)) {
                            return false;
                        }
                        return true;
                    }
                    return false;
                }
        ).toArray();
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
    public RowMapper<T> Mapper(boolean isSumAggregate) {
        if (_mapperInstance == null) {
            var handler = new SqlQueryableInvocationHandler(_class);
            handler.setIsAggregateSumQuery(isSumAggregate);
            @SuppressWarnings("unchecked")
            var proxy = (RowMapper<T>) Proxy.newProxyInstance(
                RowMapper.class.getClassLoader(),
                new Class[] { RowMapper.class },
                handler
            );
            _mapperInstance = proxy;
        } else {
            // Using the memoized query handler.
            var invocationHandler = (SqlQueryableInvocationHandler)
                    Proxy.getInvocationHandler(_mapperInstance);
            invocationHandler.setIsAggregateSumQuery(isSumAggregate);
        }
        return _mapperInstance;
    }
}