import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for HTTP requests
import { API_BASE_URL } from "../../config/api";

const Contact = () => {
    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    // State for dynamic contact details fetched from the backend
    const [contactDetails, setContactDetails] = useState({
        address: '[Loading Address...]',
        phone: '[Loading Phone...]',
        email: '[Loading Email...]',
        companyName: 'Van Man Packers & Movers',
        mapLink: null // Placeholder for map embed URL/API key
    });
    const [submitStatus, setSubmitStatus] = useState('');


    // --- 1. HANDLE CONTACT MESSAGE SUBMISSION (POST) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('Sending...');

        try {
            // Send form data to the backend endpoint
            const response = await axios.post(`${API_BASE_URL}/contact`, {
                name: formData.name,
                email: formData.email,
                message: formData.message,
            });
            
            setSubmitStatus('Message Sent Successfully! 🎉');
            console.log('Server Response:', response.data);
            
            // Clear the form
            setFormData({ name: '', email: '', subject: '', message: '' });
            
        } catch (error) {
            console.error('Submission Error:', error);
            setSubmitStatus('Failed to send message. Please try again.');
        }
    };

    // --- 2. FETCH DYNAMIC CONTACT DETAILS (GET) ---
    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                // Fetch details from the dedicated backend endpoint
                const response = await axios.get(`${API_BASE_URL}/contact/details`); 
                const details = response.data?.data || {};
                setContactDetails({
                    address: details.address || '[Address unavailable]',
                    phone: details.phone || '[Phone unavailable]',
                    email: details.email || '[Email unavailable]',
                    mapLink: details.mapLink || null,
                    companyName: details.companyName || 'Van Man Packers & Movers',
                });
            } catch (error) {
                console.error('Error fetching contact details:', error);
                setContactDetails(prev => ({
                    ...prev,
                    address: '[Failed to load address]',
                    phone: '[Failed to load phone]',
                    email: '[Failed to load email]',
                }));
            }
        };

        fetchContactDetails();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Handle input changes (remains the same)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    // --- RENDER FUNCTION (UPDATED JSX) ---
    return (
        <div className="mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
            {/* ... (Header Box remains the same) ... */}
            <section className="text-center mb-12 bg-gray-50 p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-extrabold text-orange-600 sm:text-5xl">
                    Contact Us For More Info
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    We are here to answer any questions you may have. Reach out to us!
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* 4. Address Line - NOW DYNAMICALLY POPULATED */}
                <section className="bg-white p-6 shadow-lg rounded-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-sky-700 mb-6 flex items-center">
                        <span className="text-blue-500 mr-3">🏢</span> Office Address
                    </h2>
                    <address className="not-italic space-y-3 text-gray-600">
                        <p className="text-lg font-semibold text-gray-700">
                            {contactDetails.companyName}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: contactDetails.address }}></div>
                        <hr className="my-4 border-gray-200" />
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            <strong>Phone:</strong> <span className="ml-2">{contactDetails.phone}</span>
                        </p>
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <strong>Email:</strong> 
                            <a href={`mailto:${contactDetails.email}`} className="ml-2 text-blue-600 hover:text-blue-800 transition duration-150">
                                {contactDetails.email}
                            </a>
                        </p>
                    </address>
                </section>

                {/* 3. Message Form - REMAINS THE SAME (with submit status) */}
                <section className="bg-white p-6 shadow-lg rounded-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-sky-700 mb-6 flex items-center">
                        <span className="text-blue-500 mr-3">📧</span> Send Us A Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ... (Form inputs remain the same) ... */}
                        <div className="form-group">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name:</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email:</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"></textarea>
                        </div>
                        
                        <button type="submit" disabled={submitStatus === 'Sending...'} className={`w-full py-3 mt-4 text-white font-semibold rounded-md transition duration-200 ${submitStatus === 'Sending...' ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50'}`}>
                            {submitStatus === 'Sending...' ? 'Sending...' : 'Submit Message'}
                        </button>
                        {submitStatus && submitStatus !== 'Sending...' && (
                            <p className={`text-center mt-2 ${submitStatus.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                                {submitStatus}
                            </p>
                        )}
                    </form>
                </section>
            </div>
            
            {/* 2. Location API (Map Placeholder) - NOW DYNAMICALLY POPULATED */}
            <section className="mt-12">
                <h2 className="text-3xl font-bold text-sky-700 mb-6 text-center flex items-center justify-center">
                    <span className="text-blue-500 mr-3">🗺️</span> Our Location
                </h2>
                <div 
                    id="map-container" 
                    className="w-full rounded-lg shadow-xl overflow-hidden" 
                    style={{ height: '400px' }}
                >
                    {contactDetails.mapLink ? (
                        // WARNING: Using dangerouslySetInnerHTML is required for raw map iframe/embeds.
                        // Ensure the mapLink comes from a trusted source.
                        <div dangerouslySetInnerHTML={{ __html: contactDetails.mapLink }} />
                    ) : (
                        <div className="h-full w-full bg-gray-200 flex justify-center items-center">
                             <p className="text-gray-500 text-xl">
                                {contactDetails.address.includes('[Loading') ? 'Loading Map...' : '[Map not available/loaded]'}
                             </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ... (Get a Quote Button remains the same) ... */}
            <section className="text-center mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-600 mb-6">
                    Ready to Move?
                </h2>
                <Link 
                    to="/auth" 
                    className="uppercase inline-block px-30 py-6 text-xl font-extrabold text-white bg-orange-500 rounded-full shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                >Get a Quote
                </Link>
            </section>

        </div>
    );
}

export default Contact;
