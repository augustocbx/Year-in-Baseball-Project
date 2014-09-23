require 'rails_helper'

RSpec.describe EventsController, :type => :controller do

	describe 'GET #index' do

		before do
			get :index, format: :json
		end

		it "should succeed" do
			expect(response).to be_success
		end

		it "should assign @events to be all events" do
			expect(assigns(:teams).to_json include(Event.all))
		end

	end

end
