package com.theknicks.voteranalysis_backend.helpers;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.models.CollectionSortParamModel;
import java.lang.reflect.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import org.springframework.jdbc.core.RowMapper;

/*
 * NOTE(jerry):
 * This is basically a hand-rolled ORM solution,
 * which is quite simple to use, and less magic.
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

    private static Constructor<?> firstMatchingArityConstructor(
        Constructor<?>[] constructors, int targetArity) {
      for (var constructor : constructors) {
        if (constructor.getParameterCount() == targetArity) {
          return constructor;
        }
      }
      return null;
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

        var resultSet = (ResultSet) args[0];
        var resultSetMetaData = resultSet.getMetaData();
        var constructor =
            firstMatchingArityConstructor(allConstructors, resultSetMetaData.getColumnCount());
        var callingArguments = new ArrayList<Object>();
        var qualifyingFields =
            AutoSqlQueryable.filterForAllQueryableFields(
                _mappableClass.getDeclaredFields(), _isAggregateSumQuery);
        int columnNumber = 1;

        if (constructor == null) {
          throw new RuntimeException("No valid constructor found (none matching column count.)");
        }

        for (var field : qualifyingFields) {
          try {
            callingArguments.add(visitField(resultSet, field, columnNumber));
          } catch (Exception e) {
            var type = field.getType();
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

        return constructor.newInstance(callingArguments.toArray());
      }

      return null;
    }

    private static Object visitType(ResultSet resultSet, Type type, int columnNumber)
        throws SQLException, RuntimeException {
      if ((type == int.class || type == Integer.class)) {
        return resultSet.getInt(columnNumber);
      } else if ((type == float.class || type == Float.class)) {
        return resultSet.getFloat(columnNumber);
      } else if ((type == long.class || type == Long.class)) {
        return resultSet.getLong(columnNumber);
      } else if ((type == double.class || type == Double.class)) {
        return resultSet.getDouble(columnNumber);
      } else if ((type == String.class)) {
        return resultSet.getString(columnNumber);
      } else if ((type == Date.class)) {
        var newValue = resultSet.getDate(columnNumber);
        if (newValue == null) {
          return null;
        }
        return new Date(newValue.getTime());
      } else if ((type == Boolean.class) || (type == boolean.class)) {
        return resultSet.getBoolean(columnNumber);
      } else if ((type instanceof ParameterizedType)) {
        var parameterizedTypes = ((ParameterizedType) type).getActualTypeArguments();
        if ((((ParameterizedType) type).getRawType() == Optional.class)) {
          var typeParameter = parameterizedTypes[0];

          // Careful recursion, since this is a little complicated.
          if (typeParameter instanceof Class<?> innerClass) {
            return Optional.ofNullable(visitType(resultSet, innerClass, columnNumber));
          } else if (typeParameter instanceof ParameterizedType innerParamType) {
            return Optional.ofNullable(visitType(resultSet, innerParamType, columnNumber));
          }

          System.out.println(
              String.format("Optional typename = %s\n", typeParameter.getTypeName()));
          return Optional.ofNullable(visitType(resultSet, typeParameter, columnNumber));
        }
      }

      throw new RuntimeException(
          String.format(
              "The class type \"%s\" does not have a mapped function!", type.getTypeName()));
    }

    private static Object visitField(ResultSet resultSet, Field field, int columnNumber)
        throws SQLException, RuntimeException {
      // Useful if we are trying to figure things out from a generic
      // type (which in this case, really just means optional.)
      var type = field.getGenericType();
      return visitType(resultSet, type, columnNumber);
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
    return QueryWhere(new String[] {}, asSumAggregate);
  }

  public String QueryWhere(String[] whereClauses) {
    return QueryWhere(whereClauses, false);
  }

  public String QueryWhere(String[] whereClauses, boolean asSumAggregate) {
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
    var groupByClausesToAdd = autoSqlAnnotation.groupBy().length;

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

    for (var clause : whereClauses) {
      result.append("where ");
      result.append(clause);
      result.append("\n");
    }

    if (groupByClausesToAdd > 0) {
      result.append("group by\n");
      for (int i = 0; i < groupByClausesToAdd; ++i) {
        result.append(autoSqlAnnotation.groupBy()[i]);
        if (i + 1 >= groupByClausesToAdd) {
          // omit
        } else {
          result.append(",\n");
        }
      }
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

    if (sortParams.get().fields().isEmpty()) {
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
