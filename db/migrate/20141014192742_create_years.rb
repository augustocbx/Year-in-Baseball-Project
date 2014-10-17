class CreateYears < ActiveRecord::Migration
  def change
    create_table :years do |t|
      t.string :division

      t.timestamps
    end
  end
end
