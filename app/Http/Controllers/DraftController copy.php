<?php

namespace App\Http\Controllers;

use App\Models\draft;
use App\Http\Requests\StoredraftRequest;
use App\Http\Requests\UpdatedraftRequest;
use App\Models\personalInfo;
use App\Models\section;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DraftController extends Controller
{
    /**
     * Save Drafts.
     */
    public function SaveDraft(Request $request)
    {
        try {
            $draft = new draft();
            $draft->name = $request->draftName;
            
            // Store personal info and get its ID
            $personalInfo = personalInfo::create([
                'name' => $request->personalInfo['name'],
                'email' => $request->personalInfo['email'],
                'phone' => $request->personalInfo['phone'],
                'address' => $request->personalInfo['address']
            ]);
            $user = User::where('id', Auth::id())->first();
            $draft->userr()->associate($user);
            $draft->personalInfoss()->associate($personalInfo);
            $draft->save();
            

            // Store sections and get their IDs
            $sections = [];
            foreach ($request->sections as $sectionData) {
                $section = section::create([
                    'header' => $sectionData['header'],
                    'description' => $sectionData['description']
                ]);
                $sections[] = $section;
                $section->drafftt()->associate($draft);
                $section->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Draft saved successfully',
                'draft' => $draft,
                'sections' => $sections
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving draft',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function CreateCV($cvId)
    {
        $sections = [
            [ 
            "description" => "<ul><li><strong>Programming Languages:</strong> PHP, JavaScript, TypeScript, Python, SQL, HTML, CSS</li><li><strong>Web Development Frameworks &amp; Libraries:</strong> Laravel, React, Inertia.js, Tailwind CSS, Next.js</li><li><strong>Mobile Development:</strong> React Native, Firebase Cloud Messaging (FCM)</li><li><strong>Database Management:</strong> MySQL, PostgreSQL, SQLite, MongoDB</li></ul>",
            "header" => "Skills"
            ],
            [
            "description" => "<ul><li><strong>Green Computing Lab Network Design</strong></li><li><strong>EWU Portal Replication using Laravel</strong></li><li><strong>CNN Model for Sugarcane Leaf Disease Classification</strong></li><li><strong>Exploratory Data Analysis on CBC Blood Test Dataset</strong></li><li><strong>SSL Certification Creation for Cybersecurity</strong></li></ul>",
            "header" => "Academic Projects"
            ],
            [ 
            "description" => "<ul><li><strong>Full Stack Developer - Respect Communication App</strong></li><li><strong>Software Developer - SUCSOM (Audit and Report Generation Dashboard)</strong></li><li><strong>Web Developer - Green Computing Lab (35 PCs)</strong></li><li><strong>Mobile Developer – Real-Time Chat Application</strong></li></ul>",
            "header" => "Experience"
            ]
        ];

        $personalInfos = [
            'name' => 'Akash Ahmed',
            'email' => 'akashahmed662001@gmail.com',
            'phone' => '01628351700',
            'address' => 'Uttara, Dhaka, 1230'
        ];

        $draft = new draft();
        //assigning the draft name with current time
        $draft->name = 'draft_'.now();
        
        // Store personal info and get its ID
        $personalInfo = personalInfo::create([
            'name' => $personalInfos['name'],
            'email' => $personalInfos['email'],
            'phone' => $personalInfos['phone'],
            'address' => $personalInfos['address']
        ]);
        $user = User::where('id', Auth::id())->first();
        $draft->userr()->associate($user);
        $draft->personalInfoss()->associate($personalInfo);
        $draft->save();
        

        // Store sections and get their IDs
        $sections = [];
        foreach ($sections as $sectionData) {
            $section = section::create([
                'header' => $sectionData['header'],
                'description' => $sectionData['description']
            ]);
            $sections[] = $section;
            $section->drafftt()->associate($draft);
            $section->save();
        }

        return redirect()->route('GoToCv', [
            'cvId' => $cvId,
            'draftId' => $draft->id,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function GoToCv($cvId, $draftId)
    {
        $draft = draft::where('id', $draftId)->first();
        $sections = section::where('draft_id', $draftId)->get();
        $personalInfo = personalInfo::where('id', $draft->personal_info_id)->first();
        dd($draftId);
        return Inertia::render('CreateCV'.$cvId, [
            'draft' => $draft,
            'sectionss' => $sections,
            'personalInfos' => $personalInfo
        ]);
    }
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
    public function store(StoredraftRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(draft $draft)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(draft $draft)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatedraftRequest $request, draft $draft)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(draft $draft)
    {
        //
    }
}
