package com.spl3.defect_prediction.model;

import org.json.simple.JSONObject;

public class McCabe {
    private double mccabeLoc;             // McCabe's line count of code
    private double cyclomaticComplexity; // Cyclomatic complexity (v(g))
    private double essentialComplexity;   // Essential complexity (ev(g))
    private double designComplexity;      // Design complexity (iv(g))
    private double branchCount;           // Flow graph branch count
    private double decisionCount;          // Decision count
    private double cyclomaticDensity;      // Cyclomatic density
    private double normalizedCyclomaticComplexity; // Normalized cyclomatic complexity

    // Constructor
    public McCabe(){}
    public McCabe(double loc, double cyclomaticComplexity, double essentialComplexity,
                  double designComplexity, double branchCount, double decisionCount,
                  double cyclomaticDensity, double normalizedCyclomaticComplexity) {
        this.mccabeLoc = loc;
        this.cyclomaticComplexity = cyclomaticComplexity;
        this.essentialComplexity = essentialComplexity;
        this.designComplexity = designComplexity;
        this.branchCount = branchCount;
        this.decisionCount = decisionCount;
        this.cyclomaticDensity = cyclomaticDensity;
        this.normalizedCyclomaticComplexity = normalizedCyclomaticComplexity;
    }

    // Method to convert to JSON
    public JSONObject toJson() {
        JSONObject json = new JSONObject();
        json.put("mccabeLoc", "McCabe's Line Count of Code");
        json.put("cyclomaticComplexity", "Cyclomatic complexity (v(g))");
        json.put("essentialComplexity", "Essential complexity (ev(g))");
        json.put("designComplexity", "Design complexity (iv(g))");
        json.put("branchCount", "Flow Graph Branch Count");
        json.put("decisionCount", "Decision Count");
        json.put("cyclomaticDensity", "Cyclomatic Density");
        json.put("normalizedCyclomaticComplexity", "Normalized Cyclomatic Complexity");
        return json;
    }

    // Getters and Setters
    public double getMccabeLoc() { return mccabeLoc; }
    public void setMccabeLoc(double mccabeLoc) { this.mccabeLoc = mccabeLoc; }

    public double getCyclomaticComplexity() { return cyclomaticComplexity; }
    public void setCyclomaticComplexity(double cyclomaticComplexity) { this.cyclomaticComplexity = cyclomaticComplexity; }

    public double getEssentialComplexity() { return essentialComplexity; }
    public void setEssentialComplexity(double essentialComplexity) { this.essentialComplexity = essentialComplexity; }

    public double getDesignComplexity() { return designComplexity; }
    public void setDesignComplexity(double designComplexity) { this.designComplexity = designComplexity; }

    public double getBranchCount() { return branchCount; }
    public void setBranchCount(double branchCount) { this.branchCount = branchCount; }

    public double getDecisionCount() { return decisionCount; }
    public void setDecisionCount(double decisionCount) { this.decisionCount = decisionCount; }

    public double getCyclomaticDensity() { return cyclomaticDensity; }
    public void setCyclomaticDensity(double cyclomaticDensity) { this.cyclomaticDensity = cyclomaticDensity; }

    public double getNormalizedCyclomaticComplexity() { return normalizedCyclomaticComplexity; }
    public void setNormalizedCyclomaticComplexity(double normalizedCyclomaticComplexity) { this.normalizedCyclomaticComplexity = normalizedCyclomaticComplexity; }
}

