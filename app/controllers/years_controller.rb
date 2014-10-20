class YearsController < ApplicationController
	respond_to :json

	def show
		@year = Year.find(params[:id])
		respond_with @year, each_serializer: YearSerializer
	end
	
end
