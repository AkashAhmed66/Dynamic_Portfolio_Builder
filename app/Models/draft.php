<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class draft extends Model
{
    /** @use HasFactory<\Database\Factories\DraftFactory> */
    use HasFactory;
    protected $fillable = ['name', 'user_id', 'personal_info_id', 'section_id'];
    
    public function userr()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function personalInfoss()
    {
        return $this->belongsTo(personalInfo::class, 'personal_info_id', 'id');
    }

    public function sectionss()
    {
        return $this->hasMany(section::class, 'draft_id', 'id');
    }
}
