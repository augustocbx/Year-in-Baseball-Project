class AddDescriptionToYears < ActiveRecord::Migration
  def change
  	add_column :years, :description, :text
  end
end
