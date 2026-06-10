<?php

namespace App\Http\Controllers;

use App\Models\NetworkDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NetworkDeviceController extends Controller
{
    public function index()
    {
        $devices = NetworkDevice::all();
        return response()->json($devices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:Router,Switch,OLT,Access Point,Server,Other',
            'ip_address' => 'required|string|ip',
            'username' => 'nullable|string',
            'password' => 'nullable|string',
            'api_port' => 'nullable|string',
        ]);

        $device = NetworkDevice::create($validated);

        return response()->json([
            'message' => 'Device created successfully',
            'data' => $device
        ], 201);
    }

    public function update(Request $request, NetworkDevice $networkDevice)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|in:Router,Switch,OLT,Access Point,Server,Other',
            'ip_address' => 'sometimes|required|string|ip',
            'username' => 'nullable|string',
            'password' => 'nullable|string',
            'api_port' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $networkDevice->update($validated);

        return response()->json([
            'message' => 'Device updated successfully',
            'data' => $networkDevice
        ]);
    }

    public function destroy(NetworkDevice $networkDevice)
    {
        $networkDevice->delete();
        return response()->json(['message' => 'Device deleted successfully']);
    }

    public function status()
    {
        $devices = NetworkDevice::where('is_active', true)->get();
        
        $results = [];
        
        foreach ($devices as $device) {
            // For a real implementation, we would use a library to connect to the Mikrotik API
            // such as \RouterOS\Client or SNMP to fetch real CPU/Memory.
            // Here we simulate the ping with fsockopen to port 80 or api_port (very fast timeout)
            
            $port = $device->api_port ?: 80;
            $ip = $device->ip_address;
            
            $status = 'offline';
            $uptime = '-';
            $cpu = 0;
            $memory = 0;
            $clients = 0;
            
            // Try socket connection to simulate ping (timeout 1s to prevent hanging)
            $connection = @fsockopen($ip, $port, $errno, $errstr, 1);
            
            if (is_resource($connection)) {
                $status = 'online';
                fclose($connection);
                
                // If online, we simulate fetching resource stats because we don't have the real API connected here
                // In production, you would replace this block with real Mikrotik API calls
                $device->last_seen_at = now();
                $device->status = 'online';
                $device->save();
                
                $uptime = rand(1, 100) . 'd ' . rand(1, 23) . 'h ' . rand(1, 59) . 'm';
                $cpu = rand(5, 60);
                $memory = rand(20, 80);
                $clients = rand(10, 500);
            } else {
                $device->status = 'offline';
                $device->save();
            }
            
            $results[] = [
                'id' => $device->id,
                'name' => $device->name,
                'type' => $device->type,
                'ip' => $device->ip_address,
                'status' => $status,
                'uptime' => $uptime,
                'cpu' => $cpu,
                'memory' => $memory,
                'clients' => $clients,
            ];
        }
        
        return response()->json($results);
    }
}
