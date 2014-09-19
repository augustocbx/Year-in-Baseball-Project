# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140919222618) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "days", force: true do |t|
    t.string   "team_id"
    t.string   "game_id"
    t.date     "date"
    t.integer  "wins"
    t.integer  "losses"
    t.integer  "wins_over"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "games_behind"
    t.integer  "place"
  end

  create_table "games", force: true do |t|
    t.string   "season"
    t.date     "date"
    t.string   "game_id"
    t.string   "team_home_id"
    t.string   "team_visitor_id"
    t.string   "location"
    t.integer  "score_home"
    t.integer  "score_visitor"
    t.string   "stadium"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "teams", force: true do |t|
    t.text     "city"
    t.text     "name"
    t.text     "league"
    t.text     "state"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "standing"
  end

end
