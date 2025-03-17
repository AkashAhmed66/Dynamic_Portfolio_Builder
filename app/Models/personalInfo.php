<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class personalInfo extends Model
{
    /** @use HasFactory<\Database\Factories\PersonalInfoFactory> */
    use HasFactory;
    protected $fillable = ['name', 'email', 'phone', 'address', 'user_id'];

    public function draftts()
    {
        return $this->hasOne(draft::class, 'personal_info_id', 'id');
    }
}
