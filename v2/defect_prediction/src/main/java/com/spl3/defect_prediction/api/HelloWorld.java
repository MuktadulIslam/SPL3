package com.spl3.defect_prediction.api;

import com.spl3.defect_prediction.model2.MetricData;
import com.spl3.defect_prediction.model2.PredictionData;
import com.spl3.defect_prediction.model2.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class HelloWorld {
    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return Arrays.asList(
                new User("Alice", 30),
                new User("Bob", 25)
        );
    }

    @GetMapping("/metrics")
    public PredictionData getMetrics() {
        // Sample data
        Map<String, MetricData> data = new HashMap<>();
        data.put("File1.java", new MetricData(5, 3, 2, 1, 4, 2, 1, 1, 3, 2, 100, 5, 3, 2, 4, 1, 2, 3, 5, 7, true));
        data.put("File2.java", new MetricData(6, 2, 3, 2, 5, 3, 2, 2, 4, 3, 150, 6, 4, 3, 5, 2, 3, 4, 6, 8, false));

        return new PredictionData("Java", "Complexity", "Class", data);
    }

    @PostMapping("/predict-classes")
    public String classDefectPrediction(){
        return "hello world";
    }
}
