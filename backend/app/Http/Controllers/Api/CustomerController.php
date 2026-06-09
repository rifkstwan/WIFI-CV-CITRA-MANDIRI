<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Get all customers with their latest active or pending order.
     */
    public function index()
    {
        // Get users with role 'customer'
        $customers = User::role('customer')
            ->orderByDesc('created_at')
            ->get();

        // Attach their latest active order to determine their current status
        $customers->map(function ($customer) {
            $latestOrder = Order::with('paket')
                ->where('user_id', $customer->id)
                ->orderByDesc('created_at')
                ->first();

            $customer->latest_order = $latestOrder;
            $customer->status = $latestOrder ? $latestOrder->status : 'inactive';
            
            return $customer;
        });

        return response()->json($customers);
    }

    /**
     * Store a new customer.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        $user->assignRole('customer');

        return response()->json([
            'message' => 'Customer created successfully',
            'customer' => $user
        ], 201);
    }

    /**
     * Update customer status (by updating their latest order status).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:aktif,suspend,ditolak,selesai',
        ]);

        $customer = User::findOrFail($id);

        $latestOrder = Order::where('user_id', $customer->id)
            ->orderByDesc('created_at')
            ->first();

        if (!$latestOrder) {
            return response()->json([
                'message' => 'Customer does not have any orders to update'
            ], 400);
        }

        $latestOrder->update(['status' => $request->status]);

        return response()->json([
            'message' => "Customer status updated to {$request->status}",
            'status' => $request->status
        ]);
    }

    /**
     * Update customer details.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        return response()->json([
            'message' => 'Customer updated successfully',
            'customer' => $user
        ]);
    }

    /**
     * Delete a customer.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Also delete their orders/tickets or let foreign keys handle it
        $user->delete();

        return response()->json([
            'message' => 'Customer deleted successfully'
        ]);
    }
}
