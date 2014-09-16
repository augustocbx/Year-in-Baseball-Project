require 'rails_helper'

RSpec.describe DaysController, :type => :controller do

	describe 'GET #index' do

		before do
			get :index, format: :json
		end

		it "should succeed" do
			expect(response).to be_success
		end

		it "should assign @teams to be all days" do
			expect(assigns(:teams).to_json include(Day.all))
		end

	end

end
