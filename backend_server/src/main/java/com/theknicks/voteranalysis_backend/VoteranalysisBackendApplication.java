package com.theknicks.voteranalysis_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
class DummyController {
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
}

@SpringBootApplication
public class VoteranalysisBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(VoteranalysisBackendApplication.class, args);
	}
}
