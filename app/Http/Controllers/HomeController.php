<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Config;

class HomeController extends Controller
{
   public static function index()
   {
      $path = Config::get('constants.build_path') . '\\index.html';

      $html = view('index')->render();

      HomeController::saveFile($path, $html);
   }
}
