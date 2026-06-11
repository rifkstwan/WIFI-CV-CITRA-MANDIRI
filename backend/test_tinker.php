<?php
$user = \App\Models\User::where('email', 'teknisi@citra.com')->first();
try {
    $middleware = new \Spatie\Permission\Middleware\RoleMiddleware();
    $request = \Illuminate\Http\Request::create('/api/technician/dashboard', 'GET');
    $request->setUserResolver(function() use ($user) { return $user; });
    $middleware->handle($request, function() { echo "SUCCESS\n"; }, 'teknisi|admin');
} catch (\Exception $e) {
    echo "EXCEPTION: " . get_class($e) . "\n";
    echo $e->getMessage() . "\n";
}
