require 'rails_helper'

RSpec.describe GamesController, :type => :controller do

	describe 'GET #index' do

		before do
			get :index, format: :json
		end

		it "should succeed" do
			expect(response).to be_success
		end

		it "should assign @games to be all games" do
			expect(assigns(:games).to_json include(Game.all))
		end

	end

end
