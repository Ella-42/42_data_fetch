# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: lpeeters <lpeeters@student.s19.be>         +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/12/18 20:28:30 by lpeeters          #+#    #+#              #
#    Updated: 2025/01/17 17:50:46 by lpeeters         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

up:
	@docker-compose up --build -d

down:
	@docker-compose down

status:
	@docker ps -a

logs:
	@echo 'Webserver:'
	@docker logs webserver
	@echo ''
	@echo '----------'
	@echo 'Retriever:'
	@docker logs retriever

re: down up

.PHONY: up down status re
