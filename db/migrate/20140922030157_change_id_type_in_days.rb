class ChangeIdTypeInDays < ActiveRecord::Migration
  def change
  	change_column :days, :id, :string
  end
end
