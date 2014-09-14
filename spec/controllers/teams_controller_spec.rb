require 'rails_helper'

RSpec.describe TeamsController, :type => :controller do

	describe 'GET #index' do

		before do
			get :index, format: :json
		end

		it "should succeed" do
			expect(response).to be_success
		end

		it "should assign @teams to be all teams" do
			expect(assigns(:teams).to_json include(Team.all))
		end

	end

end
