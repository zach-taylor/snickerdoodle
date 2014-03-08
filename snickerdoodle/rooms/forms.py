# -*- coding: utf-8 -*-

from flask.ext.wtf import Form
from wtforms import TextField, DateField, SubmitField
from wtforms.validators import DataRequired

class RoomForm(Form):
    name = TextField('name', validators=[DataRequired()])
    # A demo of datepicker.
    #created_time = DateField(u'Created time')
    submit = SubmitField(u'Save')