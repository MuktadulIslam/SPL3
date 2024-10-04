package com.spl3.defect_prediction.model2;

import java.util.Map;

public class PredictionData {
    private String lang;
    private String metricesType;
    private String metricesScope;
    private Map<String, MetricData> data;

    // Constructors, getters, and setters
    public PredictionData(String lang, String metricesType, String metricesScope, Map<String, MetricData> data) {
        this.lang = lang;
        this.metricesType = metricesType;
        this.metricesScope = metricesScope;
        this.data = data;
    }

    public Map<String, MetricData> getData() {
        return data;
    }

    public void setData(Map<String, MetricData> data) {
        this.data = data;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getMetricesScope() {
        return metricesScope;
    }

    public void setMetricesScope(String metricesScope) {
        this.metricesScope = metricesScope;
    }

    public String getMetricesType() {
        return metricesType;
    }

    public void setMetricesType(String metricesType) {
        this.metricesType = metricesType;
    }
}
