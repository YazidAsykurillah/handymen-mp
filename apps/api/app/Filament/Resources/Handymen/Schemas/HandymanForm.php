<?php

namespace App\Filament\Resources\Handymen\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\CheckboxList;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Filament\Schemas\Components\Utilities\Set;

class HandymanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Info')->components([
                    TextInput::make('email')
                        ->email()
                        ->required()
                        ->disabledOn('edit'),
                    TextInput::make('password')
                        ->password()
                        ->required(fn (string $operation): bool => $operation === 'create')
                        ->visibleOn('create'),
                    TextInput::make('name')
                        ->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                    TextInput::make('slug')
                        ->required()
                        ->unique(ignoreRecord: true),
                    Textarea::make('bio')->columnSpanFull(),
                    TextInput::make('phone'),
                    TextInput::make('whatsapp'),
                    FileUpload::make('photo_profile')->image(),
                ])->columns(2),

                Section::make('Location')->components([
                    Select::make('province_id')
                        ->relationship('province', 'name')
                        ->searchable()
                        ->preload()
                        ->live(),
                    Select::make('city_id')
                        ->relationship('city', 'name')
                        ->searchable()
                        ->preload(),
                    TextInput::make('address'),
                    TextInput::make('latitude')->numeric(),
                    TextInput::make('longitude')->numeric(),
                ])->columns(2),

                Section::make('Categories')->components([
                    CheckboxList::make('categories')
                        ->relationship('categories', 'name')
                        ->columns(3),
                ]),

                Section::make('Status')->components([
                    Toggle::make('is_verified'),
                    Toggle::make('is_premium'),
                    Toggle::make('is_active'),
                ])->columns(3),
            ]);
    }
}
