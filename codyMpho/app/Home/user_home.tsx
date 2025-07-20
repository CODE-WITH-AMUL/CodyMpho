import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Switch,
    Appearance,
    useColorScheme,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Get device width for responsive styling
const { width } = Dimensions.get('window');

// --- Interfaces for better type safety ---
interface Course {
    id: number;
    title: string;
    category: string; // This will map to our topic categories
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
    imageUrl: string;
    rating: number;
}

interface Topic {
    name: string;
    icon: string; // Ionicons name
}

// --- Theme Colors (Refined for a cleaner mobile look) ---
const Colors = {
    light: {
        background: '#F0F2F5', // Lighter background for light mode
        text: '#1A202C', // Dark text
        subText: '#4A5568', // Medium gray text
        primary: '#6A5ACD', // Slate Blue - a vibrant primary
        primaryLight: '#A78BFA', // Lighter primary for accents
        cardBackground: 'white',
        shadowColor: '#000',
        heroBackground: 'rgba(106, 90, 205, 0.9)', // Primary color with some transparency
        searchBackground: 'white',
        searchIcon: '#718096', // Gray-500
        topicPillBackground: 'white', // White for topic pills (with shadow)
        topicText: '#1A202C', // Dark text for topic pills
        badgeBackground: '#E2E8F0', // Light gray for badges
        badgeText: '#4A5568',
        starColor: '#F6E05E', // Yellow
        buttonBackground: '#6A5ACD',
        buttonText: 'white',
        switchTrackFalse: '#CBD5E0', // Gray-300
        switchThumbFalse: '#F7FAFC', // White
        heroOverlay: 'rgba(106, 90, 205, 0.7)', // Overlay for hero image
        heroImageTint: 'rgba(255,255,255,0.1)', // Very subtle tint for hero image
        topicIconColor: '#6A5ACD', // Icon color for topic pills
    },
    dark: {
        background: '#1A202C', // Dark background
        text: '#E2E8F0', // Light text
        subText: '#A0AEC0', // Lighter gray text
        primary: '#805AD5', // Darker Violet - primary for dark mode
        primaryLight: '#B794F4', // Lighter violet for accents
        cardBackground: '#2D3748', // Darker card background
        shadowColor: '#000',
        heroBackground: 'rgba(74, 43, 130, 0.9)', // Darker primary with some transparency
        searchBackground: '#2D3748',
        searchIcon: '#A0AEC0',
        topicPillBackground: '#2D3748', // Darker card background for topic pills
        topicText: '#E2E8F0', // Light text for topic pills
        badgeBackground: '#4A5568', // Dark gray for badges
        badgeText: '#E2E8F0',
        starColor: '#ECC94B', // Darker Yellow
        buttonBackground: '#805AD5',
        buttonText: 'white',
        switchTrackFalse: '#4A5568', // Dark gray
        switchThumbFalse: '#E2E8F0', // Light gray
        heroOverlay: 'rgba(74, 43, 130, 0.7)', // Overlay for hero image
        heroImageTint: 'rgba(0,0,0,0.3)', // Darker subtle tint for hero image
        topicIconColor: '#B794F4', // Icon color for topic pills
    },
};

// --- Navbar Component (Restored and compact) ---
const Navbar: React.FC<{ themeColors: typeof Colors.light; onMenuPress: () => void }> = ({ themeColors, onMenuPress }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.navbar, { paddingTop: insets.top, backgroundColor: themeColors.cardBackground, borderBottomColor: themeColors.badgeBackground }]}>
            <View style={styles.navbarContainer}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Ionicons name="book-outline" size={26} color={themeColors.primary} />
                    <Text style={[styles.logoText, { color: themeColors.text }]}>LearnHub</Text>
                </View>

                {/* Right-aligned Menu Icon */}
                <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
                    <Ionicons name="menu-outline" size={26} color={themeColors.subText} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// --- Course Card Component ---
const CourseCard: React.FC<{ course: Course; themeColors: typeof Colors.light }> = ({ course, themeColors }) => {
    const handleStartLearningPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        // Implement navigation to course detail screen
        console.log(`Starting course: ${course.title}`);
    };

    return (
        <TouchableOpacity
            style={[styles.courseCard, { backgroundColor: themeColors.cardBackground, shadowColor: themeColors.shadowColor }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.8}
        >
            <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />
            <View style={styles.courseCardContent}>
                <Text style={[styles.courseTitle, { color: themeColors.text }]}>{course.title}</Text>

                <View style={styles.courseBadges}>
                    <View style={[styles.badge, { backgroundColor: themeColors.badgeBackground }]}>
                        <Text style={[styles.badgeText, { color: themeColors.badgeText }]}>{course.category}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: themeColors.badgeBackground }]}>
                        <Text style={[styles.badgeText, { color: themeColors.badgeText }]}>{course.level}</Text>
                    </View>
                </View>

                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                        <Ionicons
                            key={i}
                            name={i < Math.floor(course.rating) ? "star" : "star-outline"}
                            size={16}
                            color={themeColors.starColor}
                        />
                    ))}
                    <Text style={[styles.ratingText, { color: themeColors.subText }]}>{course.rating.toFixed(1)}</Text>
                </View>

                <Text style={[styles.courseDescription, { color: themeColors.subText }]}>{course.description}</Text>

                <TouchableOpacity
                    style={[styles.startLearningButton, { backgroundColor: themeColors.buttonBackground, shadowColor: themeColors.buttonBackground }]}
                    onPress={handleStartLearningPress}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.startLearningButtonText, { color: themeColors.buttonText }]}>Start Learning</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

// --- Topic Card Component (New) ---
const TopicCard: React.FC<{ topic: Topic; themeColors: typeof Colors.light }> = ({ topic, themeColors }) => (
    <TouchableOpacity
        style={[styles.topicPill, { backgroundColor: themeColors.topicPillBackground, shadowColor: themeColors.shadowColor }]}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        activeOpacity={0.8}
    >
        <Ionicons name={topic.icon as any} size={28} color={themeColors.topicIconColor} style={styles.topicIcon} />
        <Text style={[styles.topicText, { color: themeColors.topicText }]}>{topic.name}</Text>
    </TouchableOpacity>
);


// --- Placeholder Data (Expanded for more topics) ---
const FEATURED_COURSES: Course[] = [
    // Existing courses
    {
        id: 1,
        title: 'Mastering Python for AI',
        category: 'AI & ML',
        level: 'Intermediate',
        description: 'Dive deep into Python libraries like TensorFlow and PyTorch for advanced AI development. Build intelligent systems from scratch.',
        imageUrl: 'https://images.unsplash.com/photo-1550439099-c88fc7030113?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.8,
    },
    {
        id: 2,
        title: 'Fullstack JavaScript Dev',
        category: 'Web Dev',
        level: 'Advanced',
        description: 'Learn MERN stack to build scalable web applications. Master React, Node.js, Express, and MongoDB.',
        imageUrl: 'https://images.unsplash.com/photo-1521185498063-ce20c0250761?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.7,
    },
    {
        id: 3,
        title: 'Cybersecurity Essentials',
        category: 'Cybersecurity',
        level: 'Beginner',
        description: 'Understand the fundamentals of cybersecurity, network security, and protecting digital assets from threats.',
        imageUrl: 'https://images.unsplash.com/photo-1544890253-3b4e69d12a91?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.5,
    },
    {
        id: 4,
        title: 'Data Science with R',
        category: 'Data Science',
        level: 'Intermediate',
        description: 'Explore statistical computing and graphics with R for data analysis, visualization, and predictive modeling.',
        imageUrl: 'https://images.unsplash.com/photo-1554460777-be0d66c3a105?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.6,
    },
    // New courses for expanded topics
    {
        id: 5,
        title: 'GoLang Microservices',
        category: 'GoLang',
        level: 'Advanced',
        description: 'Build high-performance microservices and APIs with Go. Learn concurrency patterns and deployment strategies.',
        imageUrl: 'https://images.unsplash.com/photo-1628155931210-911296c00d41?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.7,
    },
    {
        id: 6,
        title: 'Rust for WebAssembly',
        category: 'Rust',
        level: 'Intermediate',
        description: 'Explore Rust for building performant and secure web applications with WebAssembly.',
        imageUrl: 'https://images.unsplash.com/photo-1547658718-d421516f4066?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.5,
    },
    {
        id: 7,
        title: 'React Native for Mobile Apps',
        category: 'Mobile Dev',
        level: 'Intermediate',
        description: 'Develop cross-platform iOS and Android applications using React Native. Build stunning UIs and manage state.',
        imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe65553?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.8,
    },
    {
        id: 8,
        title: 'Advanced SQL & Database Design',
        category: 'SQL',
        level: 'Advanced',
        description: 'Master complex SQL queries, optimize database performance, and design robust relational databases.',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c899c45b746c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.6,
    },
    {
        id: 9,
        title: 'AWS Certified Solutions Architect',
        category: 'Cloud Computing',
        level: 'Advanced',
        description: 'Prepare for the AWS SAA-C03 exam. Learn to design and deploy scalable, highly available systems on AWS.',
        imageUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc5923986a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.9,
    },
    {
        id: 10,
        title: 'Introduction to AI Engineering',
        category: 'AI Engineering',
        level: 'Beginner',
        description: 'Understand the lifecycle of AI products, MLOps, and deploying machine learning models in production.',
        imageUrl: 'https://images.unsplash.com/photo-1620712948689-d41c7b8e5c4d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.4,
    },
    {
        id: 11,
        title: 'Mastering PostgreSQL',
        category: 'PostgreSQL',
        level: 'Intermediate',
        description: 'Deep dive into PostgreSQL features, performance tuning, and database administration.',
        imageUrl: 'https://images.unsplash.com/photo-1510915228381-0fce8133ca0f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.6,
    },
    {
        id: 12,
        title: 'Blockchain Fundamentals',
        category: 'Blockchain',
        level: 'Beginner',
        description: 'Learn the core concepts of blockchain technology, cryptocurrencies, and decentralized applications.',
        imageUrl: 'https://images.unsplash.com/photo-1639766961445-66708a5c3d18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.3,
    },
    {
        id: 13,
        title: 'Ethical Hacking: Web Penetration',
        category: 'Cybersecurity',
        level: 'Advanced',
        description: 'Hands-on training in web application penetration testing, identifying vulnerabilities and securing systems.',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-9f150495ae40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.7,
    },
    {
        id: 14,
        title: 'Unity 3D Game Development',
        category: 'Game Dev',
        level: 'Intermediate',
        description: 'Create immersive 3D games with Unity. Learn C# scripting, physics, and animation.',
        imageUrl: 'https://images.unsplash.com/photo-1614949533355-667e6c40e5a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.6,
    },
];

const TRENDING_TOPICS: Topic[] = [
    // Languages
    { name: 'Python', icon: 'logo-python' },
    { name: 'JavaScript', icon: 'logo-javascript' },
    { name: 'TypeScript', icon: 'code-slash-outline' },
    { name: 'Java', icon: 'logo-java' },
    { name: 'C++', icon: 'code-outline' },
    { name: 'C#', icon: 'logo-windows' }, // Closest for C#
    { name: 'GoLang', icon: 'git-compare-outline' }, // General icon
    { name: 'Rust', icon: 'cog-outline' }, // General icon
    { name: 'Swift', icon: 'logo-apple' },
    { name: 'Kotlin', icon: 'phone-portrait-outline' }, // Android icon
    { name: 'PHP', icon: 'server-outline' },
    { name: 'Ruby', icon: 'flash-outline' },

    // AI & Machine Learning
    { name: 'AI Learning', icon: 'bulb-outline' },
    { name: 'Machine Learning', icon: 'analytics-outline' },
    { name: 'Deep Learning', icon: 'layers-outline' },
    { name: 'Generative AI', icon: 'sparkles-outline' },
    { name: 'Prompt Engineering', icon: 'chatbox-outline' },
    { name: 'TensorFlow', icon: 'calculator-outline' },
    { name: 'PyTorch', icon: 'cube-outline' },
    { name: 'AI Engineering', icon: 'build-outline' },

    // Web Development
    { name: 'Frontend Dev', icon: 'browsers-outline' },
    { name: 'Backend Dev', icon: 'server-outline' },
    { name: 'Fullstack Dev', icon: 'code-working-outline' },
    { name: 'React', icon: 'logo-react' },
    { name: 'Angular', icon: 'code-outline' },
    { name: 'Vue.js', icon: 'code-slash-outline' },
    { name: 'Node.js', icon: 'logo-nodejs' },
    { name: 'Django', icon: 'leaf-outline' },
    { name: 'Flask', icon: 'flask-outline' },
    { name: 'Spring Boot', icon: 'leaf-outline' },

    // Data Science & Databases
    { name: 'Data Science', icon: 'pie-chart-outline' },
    { name: 'Big Data', icon: 'cloud-download-outline' },
    { name: 'Data Analytics', icon: 'stats-chart-outline' },
    { name: 'SQL', icon: 'albums-outline' },
    { name: 'NoSQL', icon: 'server-outline' },
    { name: 'MongoDB', icon: 'leaf-outline' },
    { name: 'PostgreSQL', icon: 'server-outline' },
    { name: 'Tableau', icon: 'bar-chart-outline' },

    // Cloud Computing & DevOps
    { name: 'Cloud Computing', icon: 'cloud-outline' },
    { name: 'AWS', icon: 'cloud-outline' },
    { name: 'Azure', icon: 'cloud-outline' },
    { name: 'Google Cloud', icon: 'cloud-outline' },
    { name: 'DevOps', icon: 'sync-outline' },
    { name: 'Docker', icon: 'cube-outline' },
    { name: 'Kubernetes', icon: 'git-branch-outline' },
    { name: 'CI/CD', icon: 'repeat-outline' },

    // Mobile Development
    { name: 'Mobile Dev', icon: 'phone-portrait-outline' },
    { name: 'React Native', icon: 'logo-react' },
    { name: 'Flutter', icon: 'code-slash-outline' },
    { name: 'iOS Dev', icon: 'logo-apple' },
    { name: 'Android Dev', icon: 'logo-android' },

    // Blockchain & Web3
    { name: 'Web3', icon: 'git-network-outline' },
    { name: 'Blockchain', icon: 'link-outline' },
    { name: 'Smart Contracts', icon: 'receipt-outline' },
    { name: 'Solidity', icon: 'cube-outline' },

    // Cybersecurity
    { name: 'Cybersecurity', icon: 'lock-closed-outline' },
    { name: 'Network Security', icon: 'shield-checkmark-outline' },
    { name: 'Ethical Hacking', icon: 'bug-outline' },

    // Game Development
    { name: 'Game Dev', icon: 'game-controller-outline' },
    { name: 'Unity', icon: 'color-palette-outline' },
    { name: 'Unreal Engine', icon: 'hammer-outline' },

    // Other Tech & Methodologies
    { name: 'UI/UX Design', icon: 'brush-outline' },
    { name: 'Product Management', icon: 'cube-outline' },
    { name: 'Agile', icon: 'git-pull-request-outline' },
    { name: 'Scrum', icon: 'people-outline' },
    { name: 'IoT', icon: 'hardware-chip-outline' },
    { name: 'AR/VR', icon: 'glasses-outline' },
    { name: 'Quantum Computing', icon: 'atom-outline' },
    { name: 'Bioinformatics', icon: 'dna-outline' },
];


const POPULAR_CATEGORIES = [
    'Programming', 'AI & ML', 'Web Dev', 'Data Science', 'Cloud', 'Cybersecurity', 'Game Dev', 'Mobile Dev', 'DevOps', 'Blockchain'
];

// --- Main Home Component ---
const Home: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // For the main app menu

    // Effect to update dark mode based on system preference
    useEffect(() => {
        setIsDarkMode(systemColorScheme === 'dark');
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setIsDarkMode(colorScheme === 'dark');
        });
        return () => subscription.remove();
    }, [systemColorScheme]);

    const themeColors = isDarkMode ? Colors.dark : Colors.light;

    // Simulate data fetching for pull-to-refresh
    const onRefresh = useCallback(() => {
        setIsLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTimeout(() => {
            // In a real app, you would refetch your courses, topics, etc.
            setIsLoading(false);
        }, 1500);
    }, []);

    // Filter content based on search query
    const filteredTopics = TRENDING_TOPICS.filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Filter courses based on topic name or general search query
    const filteredCourses = FEATURED_COURSES.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            {/* Navbar - Conditionally rendered, but now always visible */}
            <Navbar themeColors={themeColors} onMenuPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsMenuOpen(!isMenuOpen);
            }} />

            {/* Main App Menu Overlay (appears on top when opened) */}
            {isMenuOpen && (
                <View style={[styles.appMenuOverlay, { backgroundColor: themeColors.background }]}>
                    <TouchableOpacity style={styles.closeMenuButton} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setIsMenuOpen(false);
                    }}>
                        <Ionicons name="close-circle-outline" size={36} color={themeColors.subText} />
                    </TouchableOpacity>
                    <Text style={[styles.appMenuTitle, { color: themeColors.text }]}>Navigation</Text>
                    <TouchableOpacity style={styles.appMenuItem} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); /* Navigate Home */ setIsMenuOpen(false); }}>
                        <Ionicons name="home-outline" size={24} color={themeColors.primary} />
                        <Text style={[styles.appMenuItemText, { color: themeColors.text }]}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.appMenuItem} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); /* Navigate Courses */ setIsMenuOpen(false); }}>
                        <Ionicons name="library-outline" size={24} color={themeColors.primary} />
                        <Text style={[styles.appMenuItemText, { color: themeColors.text }]}>My Courses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.appMenuItem} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); /* Navigate Profile */ setIsMenuOpen(false); }}>
                        <Ionicons name="person-outline" size={24} color={themeColors.primary} />
                        <Text style={[styles.appMenuItemText, { color: themeColors.text }]}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.appMenuItem} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); /* Navigate Settings */ setIsMenuOpen(false); }}>
                        <Ionicons name="settings-outline" size={24} color={themeColors.primary} />
                        <Text style={[styles.appMenuItemText, { color: themeColors.text }]}>Settings</Text>
                    </TouchableOpacity>

                    {/* Dark Mode Toggle within the menu for better organization */}
                    <View style={styles.darkModeToggleContainer}>
                        <Text style={[styles.darkModeToggleText, { color: themeColors.text }]}>Dark Mode</Text>
                        <Switch
                            trackColor={{ false: themeColors.switchTrackFalse, true: themeColors.primaryLight }}
                            thumbColor={isDarkMode ? themeColors.primary : themeColors.switchThumbFalse}
                            ios_backgroundColor={themeColors.switchTrackFalse}
                            onValueChange={(value) => {
                                setIsDarkMode(value);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            value={isDarkMode}
                        />
                    </View>
                </View>
            )}

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        tintColor={themeColors.primary}
                        colors={[themeColors.primary]}
                        progressBackgroundColor={themeColors.cardBackground}
                    />
                }
            >
                {/* Hero Section with ImageBackground */}
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1520607162513-7d4c1ee73876?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} // Placeholder image
                    style={styles.heroSection}
                    imageStyle={[styles.heroImageStyle, { tintColor: themeColors.heroImageTint }]} // Apply tint
                    resizeMode="cover"
                >
                    <View style={[styles.heroContentOverlay, { backgroundColor: themeColors.heroOverlay }]}>
                        <Text style={[styles.heroTitle, { color: themeColors.buttonText }]}>
                            Your Next Skill Awaits! 🎓
                        </Text>
                        <Text style={[styles.heroSubtitle, { color: themeColors.primaryLight }]}>
                            Explore curated courses in tech and innovation.
                        </Text>

                        {/* Search Bar */}
                        <View style={[styles.searchContainer, { backgroundColor: themeColors.searchBackground, shadowColor: themeColors.shadowColor }]}>
                            <Ionicons name="search-outline" size={20} color={themeColors.searchIcon} style={styles.searchIcon} />
                            <TextInput
                                style={[styles.searchInput, { color: themeColors.text }]}
                                placeholder="Search courses, topics..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor={themeColors.searchIcon}
                            />
                        </View>
                    </View>
                </ImageBackground>

                {/* Trending Topics Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>🔥 Trending Topics</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicsContainer}>
                        {filteredTopics.length > 0 ? (
                            filteredTopics.map((topic, index) => (
                                <TopicCard key={index} topic={topic} themeColors={themeColors} />
                            ))
                        ) : (
                            <Text style={[styles.noResultsText, { color: themeColors.subText }]}>No trending topics found for your search.</Text>
                        )}
                    </ScrollView>
                </View>

                {/* Featured Courses Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>✨ Featured Learning Paths</Text>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={themeColors.primary} style={styles.loadingIndicator} />
                    ) : filteredCourses.length > 0 ? (
                        <FlatList
                            data={filteredCourses}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <CourseCard course={item} themeColors={themeColors} />}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false} // FlatList within ScrollView
                            contentContainerStyle={styles.coursesContainer}
                        />
                    ) : (
                        <Text style={[styles.noResultsText, { color: themeColors.subText }]}>No featured learning paths found for your search.</Text>
                    )}
                </View>

                {/* Popular Categories Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>💡 Popular Categories</Text>
                    <View style={styles.categoriesContainer}>
                        {POPULAR_CATEGORIES.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.categoryCard, { backgroundColor: themeColors.cardBackground, shadowColor: themeColors.shadowColor }]}
                                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            >
                                <Text style={[styles.categoryText, { color: themeColors.text }]}>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* A simple spacer at the bottom to ensure content doesn't get cut off */}
                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // --- Navbar Styles (Further Adjusted) ---
    navbar: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 50, // Even smaller fixed height for a minimalist navbar
        justifyContent: 'center',
    },
    navbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 0, // No vertical padding, height controls it
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20, // Even smaller logo text
        fontWeight: 'bold',
        marginLeft: 8,
    },
    iconButton: {
        padding: 5, // Even smaller padding for icons
    },

    // --- Main App Menu Overlay ---
    appMenuOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    closeMenuButton: {
        alignSelf: 'flex-end',
        padding: 10,
        marginBottom: 20,
    },
    appMenuTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    appMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    appMenuItemText: {
        fontSize: 20,
        marginLeft: 15,
        fontWeight: '600',
    },

    // --- Dark Mode Toggle (Moved inside menu) ---
    darkModeToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginTop: 30,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    darkModeToggleText: {
        fontSize: 18,
        fontWeight: '500',
    },

    // --- Main Content ScrollView ---
    scrollView: {
        flex: 1,
    },

    // --- Hero Section (Updated with ImageBackground) ---
    heroSection: {
        width: '100%',
        height: 220,
        justifyContent: 'flex-end',
        paddingBottom: 25,
    },
    heroImageStyle: {
        resizeMode: 'cover',
    },
    heroContentOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        paddingHorizontal: 18,
        paddingVertical: 12,
        width: '90%',
        alignSelf: 'center',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
    },

    // --- Section Styles ---
    section: {
        paddingHorizontal: 16,
        marginBottom: 20,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    noResultsText: {
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 20,
    },
    loadingIndicator: {
        paddingVertical: 30,
    },

    // --- Trending Topics Styles (New Layout for Icons) ---
    topicsContainer: {
        flexDirection: 'row',
    },
    topicPill: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        height: 90,
        borderRadius: 15,
        marginRight: 10,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        padding: 8,
    },
    topicIcon: {
        marginBottom: 6,
    },
    topicText: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },

    // --- Course Styles (Featured Learning Paths) ---
    coursesContainer: {
        gap: 16,
    },
    courseCard: {
        borderRadius: 15,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 8,
        overflow: 'hidden',
        marginBottom: 5,
    },
    courseImage: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
    },
    courseCardContent: {
        padding: 18,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    courseBadges: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    ratingText: {
        fontSize: 14,
        marginLeft: 6,
        fontWeight: '600',
    },
    courseDescription: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 15,
    },
    startLearningButton: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    startLearningButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },

    // --- Categories Styles ---
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: -6,
        rowGap: 12,
        columnGap: 12,
    },
    categoryCard: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '47%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 90,
    },
    categoryText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default Home;
