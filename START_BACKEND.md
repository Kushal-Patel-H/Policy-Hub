# Starting the Backend Server

## Quick Start

1. Open a **new terminal/command prompt**
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. You should see:
   ```
   🔥 Firebase initialized successfully
   🚀 Server running on http://localhost:3000
   ```

5. **Keep this terminal open** - don't close it while using the app

## If You Get Errors

### "Cannot find module" errors
Run:
```bash
npm install
```

### "Port 3000 already in use"
Kill the existing process:
```powershell
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force
```

Then try starting the server again.

## Testing

Once the server is running, test it:
- Open: http://localhost:3000/
- You should see: "🚀 Policy Hub backend is running!"

## Routes Available

- `GET /api/policies?agentId=YOUR_UID` - Get all policies
- `GET /api/policies/reminders?agentId=YOUR_UID` - Get reminders
- `GET /api/policies/alerts?agentId=YOUR_UID` - Get alerts
- `POST /api/policies/add` - Create new policy

