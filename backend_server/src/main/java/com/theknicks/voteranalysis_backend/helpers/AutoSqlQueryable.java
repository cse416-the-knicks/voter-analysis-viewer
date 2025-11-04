package com.theknicks.voteranalysis_backend.helpers;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.models.CollectionSortParamModel;
import java.lang.reflect.*;
import java.sql.ResultSet;
import java.util.*;
import org.springframework.jdbc.core.RowMapper;

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

    public SqlQueryableInvocationHandler(Class<?> mappableClass) {
      _mappableClass = mappableClass;
    }

    public void setIsAggregateSumQuery(boolean v) {
      _isAggregateSumQuery = v;
    }

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

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
        var qualifyingFields =
            AutoSqlQueryable.filterForAllQueryableFields(
                _mappableClass.getDeclaredFields(), _isAggregateSumQuery);

        // I'm praying these are in order!
        int columnNumber = 1;
        var resultSetMetaData = resultSet.getMetaData();
        for (var field : qualifyingFields) {
          var type = field.getType();
          try {
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
            } else {
              throw new RuntimeException(
                  String.format(
                      "The class type \"%s\" does not have a mapped function!", type.getName()));
            }
          } catch (Exception e) {
            System.err.format(
                "\tFaulted field \"%s\": %s to column %d (labelled \"%s\")\n",
                field.getName(),
                type.getName(),
                columnNumber,
                resultSetMetaData.getColumnLabel(columnNumber));
            e.printStackTrace();
          }
          columnNumber++;
        }

        /*
         * FIXME(jerry):
         * Almost able to remove the bad code, just this
         * last vestige.
         */
        var autoSqlAnnotation = (AutoSql) _mappableClass.getAnnotation(AutoSql.class);
        if (autoSqlAnnotation.collection().contains("eavs_data")) {
          if (_isAggregateSumQuery) {
            callingArguments.add(0, "0000000000");
            callingArguments.add(1, "Aggregated");
          }
        }

        return defaultConstructor.newInstance(callingArguments.toArray());
      }

      return null;
    }
  }

  private final Class<T> _class;

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
    return Arrays.stream(fieldsList)
        .filter(
            (field) -> {
              if (getSqlName(field).isPresent()) {
                if (asSumAggregate) {
                  return !isOmittedFromSumAggregate(field);
                } else {
                  return true;
                }
              }
              return false;
            })
        .toArray(Field[]::new);
  }

  // Happens to be fine for numeric data, might need to evolve as I think
  // more about this
  public String Query(boolean asSumAggregate) {
    var result = new StringBuilder();
    var selfClass = _class;
    var autoSqlAnnotation = selfClass.getAnnotation(AutoSql.class);

    if (!autoSqlAnnotation.view().isEmpty()) {
      return QueryView();
    }

    result.append("select\n");
    // For records, which is the use-case this is everything.
    var fieldsToWrite = filterForAllQueryableFields(selfClass.getDeclaredFields(), asSumAggregate);
    var joinClausesToAdd = autoSqlAnnotation.joining().length;

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
        if (i + 1 >= fieldsToWrite.length) {
          // omit
        } else {
          result.append(",\n");
        }
      }
    }

    result.append("\nfrom ");
    result.append(autoSqlAnnotation.collection());
    for (int i = 0; i < joinClausesToAdd; ++i) {
      result.append(" ");
      result.append(autoSqlAnnotation.joinMethod()[i]);
      result.append(" join ");
      result.append(autoSqlAnnotation.joining()[i]);
      result.append(" on ");
      result.append(autoSqlAnnotation.joinOn()[i]);
      result.append("\n");
    }
    result.append("\n");
    return result.toString();
  }

  public String Query() {
    return Query(false);
  }

  // This is used for AutoSql that has views.
  public String QueryView() {
    var autoSqlAnnotation = _class.getAnnotation(AutoSql.class);
    return String.format("select * from %s ", autoSqlAnnotation.view());
  }

  public String QueryOrdering(Optional<CollectionSortParamModel> sortParams) {
    if (sortParams.isEmpty()) {
      return "";
    }
    var result = new StringBuilder();
    var selectableFields = filterForAllQueryableFields(_class.getDeclaredFields(), false);

    result.append("order by ");
    for (var param : sortParams.get().fields()) {
      if (param.sort() != null) {
        Field coorespondingField = null;

        for (var selectableField : selectableFields) {
          var sqlName = getSqlName(selectableField);
          if (sqlName.isEmpty()) {
            continue;
          }

          if (selectableField.getName().equals(param.field())) {
            coorespondingField = selectableField;
            break;
          }
        }

        if (coorespondingField != null) {
          result.append(getSqlName(coorespondingField).get());
          result.append(" ");
          result.append(param.sort());
        } else {
          System.err.println("Unable to map field name: " + param.field() + " to an SQL column");
        }
      }
    }
    return result.toString();
  }

  /** This does some really slick stuff to automate the generation of the row mappers. */
  public RowMapper<T> Mapper(boolean isSumAggregate) {
    var className = _class.getName();
    var invocationHandler = new SqlQueryableInvocationHandler(_class);
    invocationHandler.setIsAggregateSumQuery(isSumAggregate);
    @SuppressWarnings("unchecked")
    var proxy =
        (RowMapper<T>)
            Proxy.newProxyInstance(
                RowMapper.class.getClassLoader(), new Class[] {RowMapper.class}, invocationHandler);
    return proxy;
  }

  public RowMapper<T> Mapper() {
    return Mapper(false);
  }

  public static <T> AutoSqlQueryable<T> findQueryableNested(Class<T> T) {
    try {
      AutoSqlQueryable<T> queryable = null;
      Class<?>[] innerClasses = T.getDeclaredClasses();
      for (Class<?> inner : innerClasses) {
        if (inner.getSimpleName().equals("Queryable")) {
          @SuppressWarnings("unchecked")
          var constructor = (Constructor<AutoSqlQueryable<T>>) inner.getDeclaredConstructor();
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
