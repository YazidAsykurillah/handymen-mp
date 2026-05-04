<?php

namespace App\Filament\Resources\Handymen\Pages;

use App\Filament\Resources\Handymen\HandymanResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHandymen extends ListRecords
{
    protected static string $resource = HandymanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
