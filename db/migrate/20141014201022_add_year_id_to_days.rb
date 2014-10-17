class AddYearIdToDays < ActiveRecord::Migration
  def change
  	add_column :days, :year_id, :string
  end
end
