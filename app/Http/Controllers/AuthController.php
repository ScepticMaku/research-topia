<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirect(string $provider) {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider) {
        $authUser = Socialite::driver($provider)->user();

        $user = User::where('user_auth_id', $authUser->id)->first();

        if($user == null) {
            $user = User::create([
                'user_auth_id' => $authUser->getId(),
                'token' => $authUser->token,
                'refresh_token' => $authUser->refreshToken,
                'expiresIn' => $authUser->expiresIn,
                'name' => ($authUser->getName() == null) ? $authUser->getNickname() : $authUser->getName(),
                'email' => $authUser->getEmail(),
            ]);

        } else {
            $user->update([
                'token' => $authUser->token,
                'refresh_token' => $authUser->refreshToken,
                'expires_in' => $authUser->expiresIn,
            ]);
        }

        Auth::login($user);

        return redirect(route('bookmarks'));
    }
}
