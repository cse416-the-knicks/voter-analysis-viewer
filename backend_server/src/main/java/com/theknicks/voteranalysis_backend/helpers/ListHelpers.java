package com.theknicks.voteranalysis_backend.helpers;

import java.util.List;
import java.util.Optional;

public class ListHelpers {
    public static <T> Optional<T> getFirst(List<T> list) {
        if (list.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(list.getFirst());
    }

    public static <T> Optional<T> getLast(List<T> list) {
        if (list.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(list.getLast());
    }

    public static <T> Optional<T> getNth(List<T> list, int n) {
        var result = (list.get(n));
        if (result == null) {
            return Optional.empty();
        }
        return Optional.of(result);
    }
}
