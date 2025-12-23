<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Url;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResearchItem>
 */
class ResearchItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'user_id' => User::factory(),
            'url_id' => Url::factory(),
            'note' => 'test',
            'is_favorite' => true,
        ];
    }
}
