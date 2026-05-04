<?php

namespace App\Filament\Resources\Handymen\Pages;

use App\Filament\Resources\Handymen\HandymanResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditHandyman extends EditRecord
{
    protected static string $resource = HandymanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['email'] = $this->record->user->email;

        return $data;
    }
}
