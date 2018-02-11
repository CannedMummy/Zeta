<?php

namespace App\Console\Commands;

use App\Http\Controllers\HomeController;
use Illuminate\Console\Command;
use const PHP_EOL;

class Main extends Command
{
   /**
    * The name and signature of the console command.
    *
    * @var string
    */
   protected $signature = 'main:run';

   /**
    * The console command description.
    *
    * @var string
    */
   protected $description = 'Main';

   /**
    * Create a new command instance.
    *
    * @return void
    */
   public function __construct()
   {
      parent::__construct();
   }

   /**
    * Execute the console command.
    *
    * @return mixed
    */
   public function handle()
   {
      HomeController::index();

      echo 'Build successful' . PHP_EOL;
      echo 'Exiting...' . PHP_EOL;
   }
}
