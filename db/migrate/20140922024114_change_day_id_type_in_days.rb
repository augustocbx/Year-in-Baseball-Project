class ChangeDayIdTypeInDays < ActiveRecord::Migration
  def change
  	change_column :games, :id, :string
  end
end
