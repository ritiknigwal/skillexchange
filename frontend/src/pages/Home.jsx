import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-indigo-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Exchange Skills with People Near You
                    </h1>
                    <p className="text-xl mb-8 opacity-90">
                        Learn new skills by teaching what you know. Zero cost, maximum value!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">📝</div>
                            <h3 className="text-2xl font-bold mb-3">1. Add Your Skills</h3>
                            <p className="text-gray-600">
                                Tell us what you can teach and what you want to learn
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold mb-3">2. Find Matches</h3>
                            <p className="text-gray-600">
                                Our algorithm finds people who match your skills
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">🤝</div>
                            <h3 className="text-2xl font-bold mb-3">3. Exchange</h3>
                            <p className="text-gray-600">
                                Connect, chat, and start learning from each other
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Choose SkillExchange?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-3 text-green-600">💰 Free Learning</h3>
                            <p className="text-gray-700">
                                No expensive courses. Trade your knowledge for new skills.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-3 text-blue-600">🌍 Local Community</h3>
                            <p className="text-gray-700">
                                Connect with people in your city for in-person sessions.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-3 text-purple-600">⚡ Smart Matching</h3>
                            <p className="text-gray-700">
                                AI-powered algorithm finds perfect matches for you.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-3 text-orange-600">📱 Real-time Chat</h3>
                            <p className="text-gray-700">
                                Communicate instantly and schedule your sessions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of students exchanging skills in your area
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-primary px-10 py-4 rounded-lg font-semibold text-xl hover:bg-gray-100 inline-block"
                    >
                        Join Now - It's Free!
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;