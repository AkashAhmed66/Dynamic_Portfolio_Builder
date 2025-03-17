<?php

namespace App\Http\Controllers;

use App\Models\personalInfo;
use App\Http\Requests\StorepersonalInfoRequest;
use App\Http\Requests\UpdatepersonalInfoRequest;

class PersonalInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorepersonalInfoRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(personalInfo $personalInfo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(personalInfo $personalInfo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatepersonalInfoRequest $request, personalInfo $personalInfo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(personalInfo $personalInfo)
    {
        //
    }
}
