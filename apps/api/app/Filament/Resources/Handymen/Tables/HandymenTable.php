<?php

namespace App\Filament\Resources\Handymen\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class HandymenTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('photo_profile')
                    ->disk('public')
                    ->circular(),
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('city.name')->sortable(),
                TextColumn::make('province.name')->sortable(),
                IconColumn::make('is_verified')->boolean(),
                IconColumn::make('is_premium')->boolean(),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('rating_avg')->sortable(),
                TextColumn::make('review_count')->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_verified'),
                TernaryFilter::make('is_premium'),
                TernaryFilter::make('is_active'),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
