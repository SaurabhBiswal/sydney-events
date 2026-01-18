import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Loader2, Trash2, Plus, Edit, Calendar, MapPin, DollarSign, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : 'http://localhost:5001/api';

const AdminDashboard = () => {
    const { user, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalEvents: 0, totalUsers: 0, activeEvents: 0 });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        venue: '',
        price: '',
        category: 'General',
        description: '',
        imageUrl: '',
        sourceUrl: ''
    });

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchDashboardData();
    }, [isAdmin, navigate]);

    const fetchDashboardData = async () => {
        try {
            const statsRes = await axios.get(`${API_URL}/admin/stats`);
            const eventsRes = await axios.get(`${API_URL}/events`); // Admin can see all, but here we reuse public endpoint for list
            // Ideally admin should have a separate list endpoint if public one filters out inactive ones.
            // For now reusing public is fine for MVP.

            setStats(statsRes.data.stats);
            setEvents(eventsRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`${API_URL}/admin/events/${id}`);
                setEvents(events.filter(e => e._id !== id));
                setStats({ ...stats, totalEvents: stats.totalEvents - 1 });
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/admin/events`, formData);
            setEvents([res.data.data, ...events]);
            setStats({ ...stats, totalEvents: stats.totalEvents + 1 });
            setShowModal(false);
            setFormData({
                title: '', date: '', time: '', venue: '', price: '', category: 'General', description: '', imageUrl: '', sourceUrl: ''
            });
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10 text-primary-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <LayoutDashboard className="h-8 w-8 text-primary-600" />
                    Admin Dashboard
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Event
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEvents}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Active Events</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeEvents}</p>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Event Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Event</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((event) => (
                                <tr key={event._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                                    <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{event.venue}</td>
                                    <td className="px-6 py-4">{event.price}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add New Event</h2>
                            <button onClick={() => setShowModal(false)}><X className="h-6 w-6 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input required type="text" className="w-full border rounded-lg p-2" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input required type="date" className="w-full border rounded-lg p-2" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <input required type="text" className="w-full border rounded-lg p-2" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Venue</label>
                                <input required type="text" className="w-full border rounded-lg p-2" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price</label>
                                    <input required type="text" className="w-full border rounded-lg p-2" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select className="w-full border rounded-lg p-2" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="General">General</option>
                                        <option value="Music">Music</option>
                                        <option value="Food">Food</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea className="w-full border rounded-lg p-2" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input type="text" className="w-full border rounded-lg p-2" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple X icon component since we used it in modal but didn't import it in standard lucide set above if missing
const X = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default AdminDashboard;
