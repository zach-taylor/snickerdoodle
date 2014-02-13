snickerdoodle
=============

Com S 309 Team 23 Project

## Setup Instructions

### Manually
* Activate your virtual environment

```bash
    $ pip install -r requirements.txt
```

### Using develop.py

To install into a [virtualenv][virtualenv], just run the following:

```bash
    $ python develop.py install
```

Then activate the virtualenv:

```bash
    $ source ENV/bin/activate
```

And launch Flask.

### Database Setup
To install Postgres on Linux:

```bash
    $ sudo apt-get update
    $ sudo apt-get install postgres
```

To install Postgres on Mac: Go [here](http://postgresapp.com/) and download and
install the app

Change "SQLALCHEMY\_DATABASE\_URI" in snickerdoodle/settingslocal.py to use your
desired URI (though if you create a blank database called snickerdoodle with
postgres as the owner, there's no need to change it)

Then to get the latest schema, run this from your virtualenv console:

```bash
    $ python application.py db upgrade
```

## SVN Details

**URL**: https://repo.cs.iastate.edu/coms309/23/

**Creds**: NetID + NetID password

**Syncing**: [Syncing Git + SVN](http://stackoverflow.com/a/772881)

