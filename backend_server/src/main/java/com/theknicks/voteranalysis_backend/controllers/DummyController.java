package com.theknicks.voteranalysis_backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;
import java.util.Optional;
import java.util.HashMap;

@RestController
public class DummyController {
    public DummyController() {
    }
  
    @GetMapping("/test1")
    public String handleTest1() {
        return "<h1>Hello</h1>";
    }

    @GetMapping("/jsonresponse")
    public HashMap<String, Object> getJsonResponse() {
        var result = new HashMap<String, Object>();
        result.put("key0", (314159));
        result.put("key1", 3.141592654);
        result.put("key2", "value3");
        return result;
    }

    @GetMapping("/param/{id}")
    public String getParam(@PathVariable int id, @RequestParam Optional<String> requestParam) {
        var builder = new StringBuilder();
        if (requestParam.isPresent()) {
            builder.append("I got a request param: ");
            builder.append(requestParam.get());
        }
        builder.append("This is my id param");
        builder.append(id);
        return builder.toString();
    }
}
