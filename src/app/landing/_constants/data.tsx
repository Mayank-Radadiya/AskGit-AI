import {
   Brain,
   Clock,
   Zap,
   Shield,
   GitBranch,
   MessageSquare,
   Link,
} from "lucide-react";

export const features = [
   {
      icon: <Brain className="h-8 w-8" />,
      title: "Intelligent Queries",
      description:
         "Ask technical questions about any repository and get clear answers instantly.",
   },
   {
      icon: <Clock className="h-8 w-8" />,
      title: "Time-Saving",
      description:
         "Skip the guesswork with instant insights into your codebase structure.",
   },
   {
      icon: <Zap className="h-8 w-8" />,
      title: "Seamless Integration",
      description: "Compatible with both private and public Git repositories.",
   },
   {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Reliable",
      description:
         "Your data stays safe with end-to-end encryption and secure processing.",
   },
   {
      icon: <GitBranch className="h-8 w-8" />,
      title: "Version Control Insights",
      description:
         "Get detailed insights into your Git history and track changes effortlessly.",
   },
   {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Collaboration Ready",
      description:
         "Share repository insights and findings with your team seamlessly.",
   },
];

export const howItWorksSteps = [
   {
      icon: <Link className="h-8 w-8" />,
      title: "Paste Repository Link",
      description: "Simply paste your Git repository URL to get started.",
   },
   {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Ask Questions",
      description:
         "Ask about code, structure, or functionality in natural language.",
   },
   {
      icon: <Zap className="h-8 w-8" />,
      title: "Get Instant Answers",
      description: "Receive detailed and accurate answers within seconds.",
   },
];

export const stats = [
   {
      value: "100+",
      label: "Repositories Analyzed",
   },
   {
      value: "90%",
      label: "Faster Code Comprehension",
   },
   {
      value: "24/7",
      label: "AI-Powered Support",
   },
];

export const comparisonFeatures = [
   {
      name: "Query Response Time",
      traditional: "Minutes",
      askGitAi: "Seconds",
   },
   {
      name: "Natural Language Support",
      traditional: "❌",
      askGitAi: "✅",
   },
   {
      name: "Code Context Understanding",
      traditional: "Limited",
      askGitAi: "Comprehensive",
   },
   {
      name: "Integration Complexity",
      traditional: "High",
      askGitAi: "Minimal",
   },
];

export const pricingPlans = [
   {
      name: "Free",
      price: "$0",
      features: [
         "150 credits",
         "Basic AI queries",
         "Community support",
         "Basic analytics",
      ],
   },
   {
      name: "Pro",
      price: "$29",
      features: [
         "Unlimited credits",
         "Advanced AI features",
         "Priority support",
         "Advanced analytics",
         "Custom integrations",
      ],
      highlighted: true,
   },
   {
      name: "Enterprise",
      price: "Custom",
      features: [
         "Everything in Pro",
         "Dedicated support",
         "Custom AI training",
         "SLA guarantee",
         "On-premise option",
      ],
   },
];

export const faqs = [
   {
      question: "How does AskGit AI work?",
      answer:
         "AskGit AI uses advanced machine learning to analyze your Git repositories. It understands code context, commit history, and project structure to provide accurate answers to your questions.",
   },
   {
      question: "Can I use it with private repositories?",
      answer:
         "Yes! AskGit AI works with both private and public repositories. Your code remains secure with end-to-end encryption and is never stored permanently.",
   },
   {
      question: "What types of questions can it answer?",
      answer:
         "You can ask about code functionality, architecture decisions, dependency relationships, commit history, and more. The AI understands both technical and high-level questions.",
   },
   {
      question: "Is my code secure?",
      answer:
         "Absolutely. We use enterprise-grade encryption and security measures. Your code is processed in isolated environments and is never stored or shared.",
   },
];

export const loadingStates = [
   {
      text: "Sign in to your AskGit AI account to access the platform.",
   },
   {
      text: "Create a new project by linking your Git repository.",
   },
   {
      text: "Explore your personalized dashboard for an overview of your projects.",
   },
   {
      text: "Get instant summaries of commit messages for better insights.",
   },
   {
      text: "Ask technical questions to the AI for quick and clear answers.",
   },
   {
      text: "Collaborate seamlessly by inviting your team members to your project.",
   },
   {
      text: "Analyze repository trends and metrics for informed decision-making.",
   },
   {
      text: "Leverage AI tools to identify potential issues and optimize your codebase.",
   },
   {
      text: "Welcome to AskGit AI – Your Intelligent Companion for Git Repositories!",
   },
];
