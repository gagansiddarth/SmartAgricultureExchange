#!/bin/bash

# Smart Agriculture Exchange - Development Startup Script (Supabase Direct)

echo "🚀 Starting Smart Agriculture Exchange (Direct Supabase)..."

# Check if port is available
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5173 is already in use (Frontend)"
    echo "   Stopping existing frontend processes..."
    pkill -f "npm run dev" || true
    sleep 2
fi

# Start Frontend
echo "🎨 Starting Frontend (Port 5173)..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 5

# Check if frontend is running
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running at http://localhost:5173"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "🎉 Smart Agriculture Exchange (Direct Supabase) is ready!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🗄️  Database: Supabase (Direct Connection)"
echo ""
echo "📧 Demo Email Accounts (Create these in Supabase Auth):"
echo "   Farmer: farmer@demo.com / password123"
echo "   Buyer:  buyer@demo.com / password123"
echo "   Admin:  admin@demo.com / password123"
echo ""
echo "🔧 Setup Steps:"
echo "   1. Go to Supabase Dashboard > Authentication"
echo "   2. Create users with the demo emails"
echo "   3. Run create-demo-users.sql in SQL Editor"
echo "   4. Test registration and login"
echo ""
echo "Press Ctrl+C to stop the service"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping service..."
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "npm run dev" || true
    echo "✅ Service stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait
