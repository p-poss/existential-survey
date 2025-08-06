'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, EyeOff } from 'lucide-react'
import { SurveyResponse } from '@/lib/supabase'

export default function AdminDashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showResponses, setShowResponses] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/survey')
      if (response.ok) {
        const data = await response.json()
        setResponses(data.responses || [])
      } else {
        setError('Failed to fetch responses')
      }
    } catch (error) {
      setError('Error fetching responses')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'ID', 'Timestamp', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
      'Q9 Option', 'Q10 Option', 'Completion Time (seconds)'
    ]
    
    const csvContent = [
      headers.join(','),
      ...responses.map(r => [
        r.id,
        r.created_at,
        `"${r.q1.replace(/"/g, '""')}"`,
        `"${r.q2.replace(/"/g, '""')}"`,
        `"${r.q3.replace(/"/g, '""')}"`,
        `"${r.q4.replace(/"/g, '""')}"`,
        `"${r.q5.replace(/"/g, '""')}"`,
        `"${r.q6.replace(/"/g, '""')}"`,
        `"${r.q7.replace(/"/g, '""')}"`,
        `"${r.q8.replace(/"/g, '""')}"`,
        `"${r.q9.replace(/"/g, '""')}"`,
        `"${r.q10.replace(/"/g, '""')}"`,
        r.q9_option ? `"${r.q9_option.replace(/"/g, '""')}"` : '',
        r.q10_option ? `"${r.q10_option.replace(/"/g, '""')}"` : '',
        r.completion_time || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `survey_responses_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Survey Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowResponses(!showResponses)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {showResponses ? <EyeOff size={20} /> : <Eye size={20} />}
              <span>{showResponses ? 'Hide' : 'Show'} Responses</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download size={20} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Responses</h3>
            <p className="text-3xl font-bold text-blue-600">{responses.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Today</h3>
            <p className="text-3xl font-bold text-green-600">
              {responses.filter(r => 
                new Date(r.created_at).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">This Week</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {responses.filter(r => {
                const responseDate = new Date(r.created_at)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return responseDate >= weekAgo
              }).length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Avg. Completion</h3>
            <p className="text-3xl font-bold text-purple-600">
              {responses.length > 0 
                ? Math.round(responses.reduce((sum, r) => sum + (r.completion_time || 0), 0) / responses.length)
                : 0
              }s
            </p>
          </div>
        </div>

        {/* Responses List */}
        {showResponses && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Responses</h2>
            {responses.map((response, index) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-4 rounded-lg border"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    Response #{index + 1} - {new Date(response.created_at).toLocaleString()}
                  </span>
                  {response.completion_time && (
                    <span className="text-sm text-gray-500">
                      {response.completion_time}s
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Q1:</strong> {response.q1}
                  </div>
                  <div>
                    <strong>Q2:</strong> {response.q2}
                  </div>
                  <div>
                    <strong>Q3:</strong> {response.q3}
                  </div>
                  <div>
                    <strong>Q4:</strong> {response.q4}
                  </div>
                  <div>
                    <strong>Q5:</strong> {response.q5}
                  </div>
                  <div>
                    <strong>Q6:</strong> {response.q6}
                  </div>
                  <div>
                    <strong>Q7:</strong> {response.q7}
                  </div>
                  <div>
                    <strong>Q8:</strong> {response.q8}
                  </div>
                  <div>
                    <strong>Q9:</strong> {response.q9}
                    {response.q9_option && <span className="text-gray-600"> ({response.q9_option})</span>}
                  </div>
                  <div>
                    <strong>Q10:</strong> {response.q10}
                    {response.q10_option && <span className="text-gray-600"> ({response.q10_option})</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
