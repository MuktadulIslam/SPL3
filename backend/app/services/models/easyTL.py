import numpy as np
from scipy.linalg import sqrtm
from scipy.optimize import linprog
import warnings

class EasyTL:
    def __init__(self):
        """
        EasyTL: Easy Transfer Learning
        A non-parametric transfer learning method that requires no model selection
        or parameter tuning.
        """
        warnings.filterwarnings('ignore')  # Suppress optimization warnings
        
    def fit_predict(self, source_features, source_labels, target_features, apply_coral=True):
        """
        Fit EasyTL model and predict target labels
        
        Parameters:
        -----------
        source_features: np.ndarray
            Source domain features of shape (n_samples, n_features)
        source_labels: np.ndarray
            Source domain labels of shape (n_samples,)
        target_features: np.ndarray
            Target domain features of shape (n_samples, n_features)
        apply_coral: bool
            Whether to apply CORAL alignment (default: True)
            
        Returns:
        --------
        target_labels: np.ndarray
            Predicted labels for target domain
        """

        # Step 1: Intra-domain Alignment (optional)
        if apply_coral:
            source_features = self._coral_alignment(source_features, target_features)
            
        # Step 2: Calculate class centers from source domain
        unique_labels = np.unique(source_labels)
        n_classes = len(unique_labels)
        class_centers = np.zeros((n_classes, source_features.shape[1]))
        
        for i, label in enumerate(unique_labels):
            class_mask = (source_labels == label)
            class_centers[i] = np.mean(source_features[class_mask], axis=0)
            
        # Step 3: Calculate distance matrix D
        n_target = target_features.shape[0]
        D = np.zeros((n_classes, n_target))
        
        for i in range(n_classes):
            D[i] = np.sum((target_features - class_centers[i])**2, axis=1)
            
        # Step 4: Solve linear programming problem
        M = self._solve_intra_domain_programming(D, n_classes)
        
        # Step 5: Predict labels using softmax
        target_labels = np.argmax(M, axis=0)
        
        return target_labels
    
    def _coral_alignment(self, source_features, target_features):
        """
        Perform CORAL domain alignment
        """
        # Calculate covariance matrices
        source_cov = np.cov(source_features, rowvar=False) + np.eye(source_features.shape[1])
        target_cov = np.cov(target_features, rowvar=False) + np.eye(target_features.shape[1])
        
        # Calculate whitening and re-coloring transformation
        A = sqrtm(np.linalg.inv(source_cov))
        B = sqrtm(target_cov)
        
        # Transform source features
        transformed_source = source_features @ A @ B
        
        return transformed_source
    
    def _solve_intra_domain_programming(self, D, n_classes):
        """
        Solve the linear programming problem for intra-domain programming
        """
        n_target = D.shape[1]
        n_variables = n_classes * n_target
        
        # Flatten D for the objective function
        c = D.flatten()
        
        # Construct equality constraints for probability sum = 1
        A_eq = np.zeros((n_target, n_variables))
        b_eq = np.ones(n_target)
        
        for i in range(n_target):
            A_eq[i, i*n_classes:(i+1)*n_classes] = 1
            
        # Construct inequality constraints for minimum class assignment
        A_ub = np.zeros((n_classes, n_variables))
        b_ub = -np.ones(n_classes)
        
        for i in range(n_classes):
            A_ub[i, i::n_classes] = -1
            
        # Bounds for variables (0 ≤ M_ij ≤ 1)
        bounds = [(0, 1) for _ in range(n_variables)]
        
        # Solve linear programming problem
        result = linprog(
            c,
            A_ub=A_ub,
            b_ub=b_ub,
            A_eq=A_eq,
            b_eq=b_eq,
            bounds=bounds,
            method='highs'
        )
        
        # Reshape solution to probability annotation matrix M
        M = result.x.reshape((n_classes, n_target))
        
        return M