package com.spl3.defect_prediction.model;

import org.json.simple.JSONObject;

public class CK {
    private double maintainabilitySeverity;  // Maintainability Severity
    private double globalDataComplexity;      // Global data complexity
    private double globalDataDensity;          // Global data density
    private double percentComment;             // Percent comment
    private double locExecutable;              // LOC executable
    private double parameterCount;             // Parameter count
    private double callPairs;                  // Call pairs
    private double multipleConditionCount;     // Multiple condition count
    private double modifierConditionalCount;   // Modifier conditional count
    private double nodeCount;                  // Node count
    private double decisionDensity;            // Decision density
    private double designDensity;              // Design density
    private double edgeCount;                  // Edge count
    private double essentialDensity;           // Essential density
    private double numberOfLines;              // Number of lines

    // Method to convert to JSON
    public JSONObject toJson() {
        JSONObject json = new JSONObject();
        json.put("maintainabilitySeverity", "Maintainability Severity");
        json.put("globalDataComplexity", "Global Data Complexity");
        json.put("globalDataDensity", "Global Data Density");
        json.put("percentComment", "Percent Comment");
        json.put("locExecutable", "LOC Executable");
        json.put("parameterCount", "Parameter Count");
        json.put("callPairs", "Call Pairs");
        json.put("multipleConditionCount", "Multiple Condition Count");
        json.put("modifierConditionalCount", "Modifier Conditional Count");
        json.put("nodeCount", "Node Count");
        json.put("decisionDensity", "Decision Density");
        json.put("designDensity", "Design Density");
        json.put("edgeCount", "Edge Count");
        json.put("essentialDensity", "Essential Density");
        json.put("numberOfLines", "Number of Lines");
        return json;
    }

    // Constructor
    public CK(){};
    public CK(double maintainabilitySeverity, double globalDataComplexity, double globalDataDensity,
              double percentComment, double locExecutable, double parameterCount, double callPairs,
              double multipleConditionCount, double modifierConditionalCount, double nodeCount,
              double decisionDensity, double designDensity, double edgeCount, double essentialDensity,
              double numberOfLines) {
        this.maintainabilitySeverity = maintainabilitySeverity;
        this.globalDataComplexity = globalDataComplexity;
        this.globalDataDensity = globalDataDensity;
        this.percentComment = percentComment;
        this.locExecutable = locExecutable;
        this.parameterCount = parameterCount;
        this.callPairs = callPairs;
        this.multipleConditionCount = multipleConditionCount;
        this.modifierConditionalCount = modifierConditionalCount;
        this.nodeCount = nodeCount;
        this.decisionDensity = decisionDensity;
        this.designDensity = designDensity;
        this.edgeCount = edgeCount;
        this.essentialDensity = essentialDensity;
        this.numberOfLines = numberOfLines;
    }



    // Getters and Setters
    public double getMaintainabilitySeverity() { return maintainabilitySeverity; }
    public void setMaintainabilitySeverity(double maintainabilitySeverity) { this.maintainabilitySeverity = maintainabilitySeverity; }

    public double getGlobalDataComplexity() { return globalDataComplexity; }
    public void setGlobalDataComplexity(double globalDataComplexity) { this.globalDataComplexity = globalDataComplexity; }

    public double getGlobalDataDensity() { return globalDataDensity; }
    public void setGlobalDataDensity(double globalDataDensity) { this.globalDataDensity = globalDataDensity; }

    public double getPercentComment() { return percentComment; }
    public void setPercentComment(double percentComment) { this.percentComment = percentComment; }

    public double getLocExecutable() { return locExecutable; }
    public void setLocExecutable(double locExecutable) { this.locExecutable = locExecutable; }

    public double getParameterCount() { return parameterCount; }
    public void setParameterCount(double parameterCount) { this.parameterCount = parameterCount; }

    public double getCallPairs() { return callPairs; }
    public void setCallPairs(double callPairs) { this.callPairs = callPairs; }

    public double getMultipleConditionCount() { return multipleConditionCount; }
    public void setMultipleConditionCount(double multipleConditionCount) { this.multipleConditionCount = multipleConditionCount; }

    public double getModifierConditionalCount() { return modifierConditionalCount; }
    public void setModifierConditionalCount(double modifierConditionalCount) { this.modifierConditionalCount = modifierConditionalCount; }

    public double getNodeCount() { return nodeCount; }
    public void setNodeCount(double nodeCount) { this.nodeCount = nodeCount; }

    public double getDecisionDensity() { return decisionDensity; }
    public void setDecisionDensity(double decisionDensity) { this.decisionDensity = decisionDensity; }

    public double getDesignDensity() { return designDensity; }
    public void setDesignDensity(double designDensity) { this.designDensity = designDensity; }

    public double getEdgeCount() { return edgeCount; }
    public void setEdgeCount(double edgeCount) { this.edgeCount = edgeCount; }

    public double getEssentialDensity() { return essentialDensity; }
    public void setEssentialDensity(double essentialDensity) { this.essentialDensity = essentialDensity; }

    public double getNumberOfLines() { return numberOfLines; }
    public void setNumberOfLines(double numberOfLines) { this.numberOfLines = numberOfLines; }
}

