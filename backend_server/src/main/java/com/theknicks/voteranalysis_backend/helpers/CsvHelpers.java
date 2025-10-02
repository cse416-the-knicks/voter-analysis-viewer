package com.theknicks.voteranalysis_backend.helpers;

import java.util.Optional;

/**
 * This static class contains some helper methods that I've been
 * using to help parse out some of the CSV files I've needed in lieu
 * of database (or in favor of.)
 */
public class CsvHelpers {
    public static Optional<String> entryOrNoneIfBlank(String s) {
        if (s.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(s);
    }

    public static Optional<Boolean> tryParseBoolean(Optional<String> s) {
        if (s.isEmpty()) {
            return Optional.empty();
        }

        var val = s.get().toLowerCase();
        if (val.equals("true")) {
            return Optional.of(true);
        } else if (val.equals("false")) {
            return Optional.of(false);
        }

        // Yes there's a difference between TRUE, FALSE, N/A
        return Optional.empty();
    }

    public static Optional<Integer> tryParseYearFromString(Optional<String> s) {
        if (s.isEmpty()) {
            return Optional.empty();
        }

        try {
            var splitString = s.get().split("/", -1);
            // For most date formats, and certainly any American date format
            // the year is the last component of the date.
            //
            // This is nearly temporary code anyway.
            return Optional.of(Integer.parseInt(splitString[splitString.length-1]));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return Optional.empty();
    }
}
