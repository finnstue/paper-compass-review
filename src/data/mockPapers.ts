
import { Paper } from '../components/PaperReviewer';

export const mockPapers: Paper[] = [
  {
    id: 1,
    title: "Deep Learning Approaches for Automated Medical Image Analysis in Diabetic Retinopathy Detection",
    abstract: "This paper presents a comprehensive study on the application of deep learning techniques for automated detection of diabetic retinopathy in fundus images. We propose a novel convolutional neural network architecture that combines attention mechanisms with residual connections to achieve state-of-the-art performance. Our method was evaluated on a dataset of 35,000 retinal images and achieved an accuracy of 94.2% in detecting various stages of diabetic retinopathy. The proposed system demonstrates significant potential for clinical deployment, potentially reducing the workload of ophthalmologists while improving early detection rates. We also present an analysis of the model's interpretability using gradient-based visualization techniques, providing insights into the features that contribute most to the classification decisions.",
    authors: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Lisa Wang", "Prof. Robert Davis"],
    keywords: ["deep learning", "medical imaging", "diabetic retinopathy", "computer vision", "healthcare AI", "convolutional neural networks"],
    year: 2023,
    isIndustry: false,
    tags: {
      computerVision: true,
      industryProblem: true,
      productPotential: true
    }
  },
  {
    id: 2,
    title: "Scalable Microservices Architecture for E-commerce Platforms: A Netflix Case Study",
    abstract: "This industry paper describes the implementation and optimization of a microservices architecture for large-scale e-commerce platforms, based on our experience at Netflix. We detail the challenges faced during the transition from a monolithic architecture to a distributed microservices system, including service discovery, load balancing, and data consistency issues. Our solution involves a custom service mesh implementation that reduced latency by 40% and improved system reliability. We also present novel approaches to canary deployments and automated rollback mechanisms that have been successfully deployed in production, handling over 100 million daily active users. The paper includes performance metrics, cost analysis, and lessons learned from three years of production deployment.",
    authors: ["John Smith", "Emily Rodriguez", "David Kim", "Sarah Thompson"],
    keywords: ["microservices", "scalability", "e-commerce", "distributed systems", "cloud architecture", "performance optimization"],
    year: 2023,
    isIndustry: true,
    tags: {
      computerVision: false,
      industryProblem: true,
      productPotential: true
    }
  },
  {
    id: 3,
    title: "Quantum Error Correction Codes: Theoretical Advances and Implementation Challenges",
    abstract: "We present new theoretical results on quantum error correction codes, specifically focusing on surface codes and their variants. This work extends previous research by proposing a novel class of topological codes that demonstrate improved error threshold properties. Our theoretical analysis shows that these codes can tolerate error rates up to 2.1%, representing a significant improvement over existing methods. We provide rigorous mathematical proofs for the error correction capabilities and present simulation results validating our theoretical predictions. While our work is primarily theoretical, we discuss potential implementation challenges on near-term quantum devices and propose solutions for some of the key obstacles. The results contribute to the fundamental understanding of quantum error correction and provide a pathway toward more robust quantum computing systems.",
    authors: ["Prof. Alice Quantum", "Dr. Bob Entanglement", "Prof. Charlie Superposition"],
    keywords: ["quantum computing", "error correction", "topological codes", "quantum information theory", "surface codes", "quantum algorithms"],
    year: 2024,
    isIndustry: false,
    tags: {
      computerVision: false,
      industryProblem: false,
      productPotential: false
    }
  },
  {
    id: 4,
    title: "Real-time Object Detection and Tracking in Autonomous Vehicles Using Edge Computing",
    abstract: "This paper addresses the critical challenge of real-time object detection and tracking in autonomous vehicles through the implementation of edge computing solutions. We present a comprehensive system that combines lightweight deep learning models with optimized hardware acceleration to achieve sub-10ms inference times for multi-object detection and tracking. Our approach utilizes a custom YOLO-based architecture optimized for edge devices, coupled with a Kalman filter-based tracking system. The system was validated on a fleet of 50 test vehicles over 100,000 miles of real-world driving conditions. Results show 99.7% accuracy in object detection with a false positive rate of less than 0.1%. We also present detailed analysis of power consumption, thermal management, and integration challenges with existing automotive systems. The solution has been successfully integrated into production vehicles by three major automotive manufacturers.",
    authors: ["Dr. Tech Leader", "AI Engineer Smith", "Hardware Specialist Jones", "Product Manager Brown"],
    keywords: ["autonomous vehicles", "edge computing", "real-time systems", "object detection", "computer vision", "automotive AI"],
    year: 2024,
    isIndustry: true,
    rating: 'interesting',
    tags: {
      computerVision: true,
      industryProblem: true,
      productPotential: true
    }
  },
  {
    id: 5,
    title: "Advanced Natural Language Processing for Legal Document Analysis",
    abstract: "We present a sophisticated natural language processing system designed specifically for legal document analysis and contract review. Our system combines transformer-based language models with domain-specific legal knowledge graphs to achieve unprecedented accuracy in contract clause extraction, risk assessment, and compliance checking. The system processes over 10,000 legal documents daily for major law firms and has demonstrated 95% accuracy in identifying critical legal issues. We introduce novel techniques for handling legal terminology, cross-references, and contextual dependencies that are unique to legal documents. The paper includes extensive evaluation on benchmark datasets and real-world deployment metrics from 18 months of production use. Our solution has reduced manual review time by 70% while maintaining high accuracy standards required in legal practice.",
    authors: ["Legal Tech Innovator", "NLP Research Scientist", "Senior Legal Advisor", "Platform Engineer"],
    keywords: ["natural language processing", "legal technology", "document analysis", "transformer models", "legal AI", "contract analysis"],
    year: 2023,
    isIndustry: true,
    rating: 'not-interesting',
    tags: {
      computerVision: false,
      industryProblem: true,
      productPotential: true
    }
  }
];
