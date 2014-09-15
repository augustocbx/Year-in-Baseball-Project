require 'rails_helper'

RSpec.describe HomeController, :type => :controller do

	describe 'GET #index' do

		before do
			get :index
		end

		it "should succeed" do
			expect(response).to be_success
		end

	end

end
