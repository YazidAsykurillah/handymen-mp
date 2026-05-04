<?php

namespace App\Filament\Resources\Handymen;

use App\Filament\Resources\Handymen\Pages\CreateHandyman;
use App\Filament\Resources\Handymen\Pages\EditHandyman;
use App\Filament\Resources\Handymen\Pages\ListHandymen;
use App\Filament\Resources\Handymen\Schemas\HandymanForm;
use App\Filament\Resources\Handymen\Tables\HandymenTable;
use App\Models\Handyman;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class HandymanResource extends Resource
{
    protected static ?string $model = Handyman::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return HandymanForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HandymenTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListHandymen::route('/'),
            'create' => CreateHandyman::route('/create'),
            'edit' => EditHandyman::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
