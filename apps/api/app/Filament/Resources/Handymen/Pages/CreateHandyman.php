<?php

namespace App\Filament\Resources\Handymen\Pages;

use App\Filament\Resources\Handymen\HandymanResource;
use App\Models\User;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;

class CreateHandyman extends CreateRecord
{
    protected static string $resource = HandymanResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'] ?? null,
        ]);

        $user->assignRole('handyman');

        $data['user_id'] = $user->id;

        unset($data['email']);
        unset($data['password']);

        return $data;
    }
}
