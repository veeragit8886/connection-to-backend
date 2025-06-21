import React from 'react'
import Content from '../Components/Content'

const Dashboard = () => {
    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <h2 className="text-2xl font-bold mb-4">Dashboard Page</h2>
                <Content />
            </div>
        </>
    )
}

export default Dashboard